import { Request } from "express";
import ErrorResponse from "./error-response";

export const validateAccounts = (
  userId: any,
  senderAcc: any,
  receiverAcc: any
) => {
  let isReceiverValid: boolean = String(receiverAcc.usuario) === String(userId);

  if (!isReceiverValid)
    return "Cuando se trata de transferencias personales, ambas cuentas deben pertenecer al mismo usuario.";

  let areAccountsEqual: boolean =
    senderAcc.account_number === receiverAcc.numero_de_cuenta;

  if (areAccountsEqual) return "Las cuentas deben ser diferentes.";
};

export const checkBalance = (
  amount: number,
  senderAcc: any
): string | undefined => {
  const currentBalance = senderAcc.balance_actual;

  const fee: number = 10;

  const notEnoughFunds: boolean =
    senderAcc.balance_disponible - fee < amount &&
    currentBalance - fee < amount;

  if (notEnoughFunds)
    return `Usted no dispone de fondos suficientes para realizar esta transferencia. Balance actual = RD$${currentBalance}. Cantidad a transferir = RD$${amount} + impuesto de RD$${fee}.00.`;
};

export const validateSameBankTransfer = (
  sender: any,
  receiverAcc: any
): undefined | string => {
  const accBelongsToTheSameUser = sender.cuentas.find(
    (v: any) => String(v) === String(receiverAcc._id)
  );

  if (!accBelongsToTheSameUser) return;

  return "La cuenta del destinatario debe pertenecer a alguien más (no puede ser suya).";
};

export const invalidInterbankTransfer = (next: any): any => {
  return next(
    new ErrorResponse(
      "La cuenta del destinatario debe proceder de un banco diferente a 'SD-Bank.",
      400
    )
  );
};

export const transferFunds = (
  senderAcc: any,
  receiverAcc: any,
  amountToTransfer: number
): void => {
  // The transaction has a RD$10.00 fee
  const tenPesosFee: number = 10;

  // Funds deducted from
  senderAcc.balance_actual -= amountToTransfer + tenPesosFee;
  senderAcc.balance_disponible -= amountToTransfer + tenPesosFee;

  // Funds transferred to
  receiverAcc.balance_actual += amountToTransfer;
  receiverAcc.balance_disponible += amountToTransfer;
};

export const processInterbankTransfer = (
  senderAcc: any,
  amountToTransfer: number
) => {
  // The transaction has a RD$10.00 fee
  const tenPesosFee: number = 10;

  // Funds deducted from
  senderAcc.balance_actual -= amountToTransfer + tenPesosFee;
  senderAcc.balance_disponible -= amountToTransfer + tenPesosFee;
};

export const getInterbankTransactionObj = (req: Request) => {
  const { _id /* account_id */ } = req.params;
  const {
    destinatario_numero_de_cuenta,
    cantidad,
    descripcion,
    destinatario_nombre,
    destinatario_cedula,
    destinatario_banco,
  } = req.body;

  const transactionFrom = {
    cuenta: _id,
    descripcion:
      descripcion ||
      `Transferencia interbancaria por la cantidad de RD${cantidad} a ${destinatario_nombre}, portador de la cédula ${destinatario_cedula}. Cuenta: ${destinatario_numero_de_cuenta}. Banco: ${destinatario_banco}.`,
    cantidad,
    tipo: "Transferencia",
  };

  return transactionFrom;
};

type TransactionObj = {
  req: Request;
  senderAcc: any;
  receiverAcc: any;
  sender: any;
  receiver: any;
};

export const getTransactionObjs = (
  transactionObj: TransactionObj
): Array<Object> => {
  const { req, senderAcc, receiverAcc, sender, receiver } = transactionObj;
  const { _id /* account_id */ } = req.params;
  const { destinatario_numero_de_cuenta, cantidad, descripcion } = req.body;

  const transactionFrom = {
    account: _id,
    descripcion:
      descripcion ||
      `RD${cantidad} transferidos a ${receiver.nombre} ${receiver.apellido}. Cuenta: ${destinatario_numero_de_cuenta}.`,
    cantidad,
    tipo: "Transferencia",
  };

  const transactionTo = {
    cuenta: receiverAcc._id,
    descripcion:
      descripcion ||
      `${sender.nombre} ${sender.apellido} transfirió RD$${cantidad} desde la cuenta: ${senderAcc.numero_de_cuenta}.`,
    cantidad,
    tipo: "Transferencia",
  };

  return [transactionFrom, transactionTo];
};

export const getTransferTransactionObj = (req: Request) => {
  const {
    receiver_account_no,
    cantidad,
    destinatario_nombre,
    destinatario_cedula,
    destinatario_banco,
    descripcion,
  } = req.body;

  const { _id /* account_id */ } = req.params;

  const transactionObj = {
    cuenta: _id,
    descripcion:
      descripcion ||
      `RD${cantidad} transferidos al ${destinatario_banco}. Destinatario: ${destinatario_nombre}. Número de cuenta ${receiver_account_no}. Cédula: ${destinatario_cedula}.`,
    cantidad,
    tipo: "Transferencia",
  };

  return transactionObj;
};

export const validateAccProvidedFields = (
  req: Request,
  interbank: boolean = false
): string | undefined => {
  const {
    usuario_id,
    destinatario_numero_de_cuenta,
    cantidad,
    destinatario_nombre,
    destinatario_cedula,
    destinatario_banco,
  } = req.body;

  const body: any = !interbank
    ? { usuario_id, destinatario_numero_de_cuenta, cantidad }
    : {
        usuario_id,
        destinatario_numero_de_cuenta,
        cantidad,
        destinatario_nombre,
        destinatario_cedula,
        destinatario_banco,
      };

  const errList = [];

  for (let elem in body) {
    if (!body[elem]) errList.push(`El campo '${elem}' es obligatorio. `);
  }

  const errorsToStr: string = errList.join("");

  if (errorsToStr) return errorsToStr.slice(0, errorsToStr.length - 1);

  if (Number(cantidad) < 2) return "Debe transferir al menos RD$2.00.";

  if (destinatario_numero_de_cuenta.length !== 10 && !interbank)
    return "El número de cuenta del destinatario debe tener 10 caracteres.";

  if (
    destinatario_numero_de_cuenta.length < 10 ||
    (destinatario_numero_de_cuenta.length > 12 && interbank)
  )
    return "El número de cuenta del destinatario debe tener entre 10 a 12 caracteres.";

  if (interbank && destinatario_cedula.length !== 13)
    return "La cédula del destinatario debe tener 13 caracteres.";
};
