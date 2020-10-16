import { Request } from "express";
import ErrorResponse from "../../../shared/utils/error-response";
import { ClientSession } from "mongoose";
import Usuario from "../../../shared/models/Usuario";
import Beneficiario from "../../../shared/models/Beneficiario";

export const validateAccounts = (
  userId: any,
  senderAcc: any,
  receiverAcc: any
) => {
  let isReceiverValid: boolean = String(receiverAcc.cliente) === String(userId);

  if (!isReceiverValid)
    return "Cuando se trata de transferencias personales, ambas cuentas deben pertenecer al mismo cliente.";

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
    return `Usted no dispone de fondos suficientes para realizar esta transferencia. Balance actual = RD$${currentBalance.toLocaleString()}. Cantidad a transferir = RD$${amount.toLocaleString()} + impuesto de RD$${fee}.00.`;
};

export const validateSameBankTransfer = (
  sender: any,
  receiverAcc: any
): undefined | string => {
  const accBelongsToTheSameUser = sender.cuentas_bancarias.find(
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
      `Transferencia interbancaria por la cantidad de RD$${cantidad.toLocaleString()} a ${destinatario_nombre}, portador de la cédula ${destinatario_cedula}. Cuenta: ${destinatario_numero_de_cuenta}. Banco: ${destinatario_banco}.`,
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
  const { cantidad, descripcion } = req.body;

  const transactionFrom = {
    descripcion:
      descripcion ||
      `RD$${cantidad.toLocaleString()} transferidos a ${receiver.nombre} ${
        receiver.apellido
      }. Cuenta: ${receiverAcc.numero_de_cuenta}.`,
    cantidad,
    tipo_entidad_asociada: "Cuenta",
    entidad_asociada: senderAcc._id,
    balance_posterior: senderAcc.balance_disponible,
  };

  const transactionTo = {
    descripcion:
      descripcion ||
      `${sender.nombre} ${
        sender.apellido
      } transfirió RD$${cantidad.toLocaleString()} desde la cuenta: ${
        senderAcc.numero_de_cuenta
      }.`,
    cantidad,
    tipo_entidad_asociada: "Cuenta",
    entidad_asociada: receiverAcc._id,
    balance_posterior: receiverAcc.balance_disponible,
  };

  return [transactionFrom, transactionTo];
};

export const getTransferTransactionObj = (
  req: Request,
  senderAcc: any,
  beneficiarioAsociado: any
) => {
  const {
    cantidad,
    destinatario_nombre,
    destinatario_cedula,
    destinatario_numero_de_cuenta,
    destinatario_banco,
    descripcion,
  } = req.body;

  const { _id /* account_id */ } = req.params;

  const mensajeDescriptivo = beneficiarioAsociado
    ? `RD$${cantidad.toLocaleString()} transferidos ${
        beneficiarioAsociado.banco_beneficiario
      }. Destinatario: ${beneficiarioAsociado.nombre}. Número de cuenta: ${
        beneficiarioAsociado.cuenta_beneficiario
      }. Cédula: ${beneficiarioAsociado.cedula}`
    : `RD$${cantidad.toLocaleString()} transferidos al ${destinatario_banco}. Destinatario: ${destinatario_nombre}. Número de cuenta ${destinatario_numero_de_cuenta}. Cédula: ${destinatario_cedula}.`;

  const transactionObj = {
    tipo_entidad_asociada: "Cuenta",
    entidad_asociada: senderAcc._id,
    descripcion: descripcion || mensajeDescriptivo,
    cantidad,
    balance_posterior: senderAcc.balance_actual,
  };

  return transactionObj;
};

export const validateAccProvidedFields = (
  req: Request,
  interbank: boolean = false,
  transBeneficiaro: boolean = false
): string | undefined => {
  const {
    cliente_id,
    destinatario_numero_de_cuenta,
    cantidad,
    destinatario_nombre,
    destinatario_cedula,
    destinatario_banco,
    destinatario_tipo_de_cuenta,
    beneficiario_id,
  } = req.body;

  const body: any =
    !interbank && transBeneficiaro
      ? { cliente_id, cantidad, beneficiario_id }
      : !interbank
      ? {
          cliente_id,
          destinatario_numero_de_cuenta,
          destinatario_tipo_de_cuenta,
          cantidad,
        }
      : interbank && transBeneficiaro
      ? {
          cliente_id,
          cantidad,
          beneficiario_id,
        }
      : {
          cliente_id,
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

  if (!transBeneficiaro) {
    if (destinatario_numero_de_cuenta.length !== 10 && !interbank)
      return "El número de cuenta del destinatario debe tener 10 caracteres.";

    if (
      destinatario_numero_de_cuenta.length < 10 ||
      (destinatario_numero_de_cuenta.length > 12 && interbank)
    )
      return "El número de cuenta del destinatario debe tener entre 10 a 12 caracteres.";

    if (interbank && destinatario_cedula.length !== 11)
      return "La cédula del destinatario debe tener 11 caracteres.";
  }
};

export const validateNewBeneficiarioFields = (
  req: Request
): string | undefined => {
  const {
    tipo,
    nombre,
    cedula,
    banco_beneficiario,
    cuenta_beneficiario,
    email,
  } = req.body;

  if (tipo !== "Tercero" && tipo !== "Interbancario")
    return "El tipo debe ser 'Tercero' o 'Interbancario'.";

  const body: any =
    tipo === "Interbancario"
      ? {
          tipo,
          nombre,
          cedula,
          banco_beneficiario,
          cuenta_beneficiario,
          email,
        }
      : {
          tipo,
          cuenta_beneficiario,
        };

  const errList = [];

  for (let elem in body) {
    if (!body[elem]) errList.push(`El campo '${elem}' es obligatorio. `);
  }

  const errorsToStr: string = errList.join("");

  return errorsToStr ? errorsToStr.slice(0, errorsToStr.length - 1) : undefined;
};

export const getSDBankBeneficiarioACrear = (
  senderAcc: any,
  receiverAcc: any,
  receiver: any,
  usuario: any = null
): Object => ({
  nombre: `${receiver.nombre} ${receiver.apellido}`,
  cedula: receiver.cedula,
  banco_beneficiario: "SD Bank",
  cuenta_beneficiario: receiverAcc.numero_de_cuenta,
  cuenta_cliente: senderAcc._id,
  email: usuario ? usuario.email : null,
});

type BeneficiarioInterbancario = {
  senderAcc: any;
  destinatario_cuenta: any;
  destinatario_cedula: string;
  destinatario_nombre: string;
  destinatario_banco: string;
  email?: string
};

export const getBeneficiarioInterbancarioACrear = (
  beneficiario: BeneficiarioInterbancario
): Object => {
  const {
    destinatario_banco,
    destinatario_cedula,
    destinatario_cuenta,
    destinatario_nombre,
    senderAcc,
    email
  } = beneficiario;

  return {
    nombre: destinatario_nombre,
    cedula: destinatario_cedula,
    banco_beneficiario: destinatario_banco,
    cuenta_beneficiario: destinatario_cuenta,
    cuenta_cliente: senderAcc._id,
    email
  };
};

type AddBeneficiario = {
  session: ClientSession;
  senderAcc: any;
  receiverAcc?: any;
  sender: any;
  receiver?: any;
  destinatario?: any;
};

export const agregarSDBankBeneficiario = async (
  objAgregar: AddBeneficiario
) => {
  const { receiver, receiverAcc, sender, senderAcc, session } = objAgregar;

  const usuario = await Usuario.findOne({
    entidad_asociada: sender._id,
  }).session(session);

  const beneficiarioACrear = getSDBankBeneficiarioACrear(
    senderAcc,
    receiverAcc,
    receiver,
    usuario
  );

  const nuevoBeneficiario: any = await Beneficiario.create(
    [beneficiarioACrear],
    { session }
  );

  senderAcc.beneficiarios.push(nuevoBeneficiario[0]._id);
};

export const agregarBeneficiarioInterbancario = async (
  objAgregar: AddBeneficiario
) => {
  const { destinatario, senderAcc, session } = objAgregar;

  const {
    destinatario_banco,
    destinatario_cedula,
    destinatario_cuenta,
    destinatario_nombre,
    email
  } = destinatario;

  const beneficiarioACrear = getBeneficiarioInterbancarioACrear({
    destinatario_banco,
    destinatario_cedula,
    destinatario_cuenta,
    destinatario_nombre,
    senderAcc,
    email
  });

  const nuevoBeneficiario: any = await Beneficiario.create(
    [beneficiarioACrear],
    { session }
  );

  senderAcc.beneficiarios.push(nuevoBeneficiario[0]._id);
};
