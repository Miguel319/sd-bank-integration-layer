import { Request, Response, NextFunction } from "express";
import Cuenta from "../models/Cuenta";
import { asyncHandler } from "../middlewares/async.middleware";
import Usuario from "../models/Usuario";
import ErrorResponse from "../utils/error-response";
import Transaccion from "../models/Transaccion";
import { notFound } from "../utils/err.helpers";
import {
  validateAccounts,
  validateSameBankTransfer,
  processInterbankTransfer,
  getTransferTransactionObj,
} from "../utils/account.helpers";
import {
  getTransactionObjs,
  validateAccProvidedFields,
} from "../utils/account.helpers";
import {
  checkBalance,
  transferFunds,
  invalidInterbankTransfer,
} from "../utils/account.helpers";

// @desc   Create account
// @route  POST /api/v1/accounts
// @access Private
export const createAccount = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { tipo_de_cuenta, numero_de_cuenta, usuario } = req.body;

    const userFound: any = await Usuario.findById(usuario);

    if (!userFound) return notFound({ entity: "Usuario", next });

    const accountToCreate = {
      tipo_de_cuenta,
      numero_de_cuenta,
      usuario,
    };

    const accountCreated: any = await Cuenta.create(accountToCreate);

    userFound.cuentas.push(accountCreated._id);

    await userFound.save();

    res.status(201).json({
      exito: true,
      mensaje: "Cuenta creada satisfactoriamente.",
    });
  }
);

// @desc   Get all accounts
// @route  GET /api/v1/accounts
// @access Private
export const getAllAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const accounts = await Cuenta.find({});

    res.status(200).json(accounts);
  }
);

// @desc   Display the accounts from a given user by searching for his/her id
// @route  GET /api/v1/accounts/user/:_id
// @access Private
export const getUserAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const userFound: any = await Usuario.findById(_id);

    if (!userFound) return notFound({ message: "Usuario", next });

    const accounts = await Cuenta.find({ _id: userFound._id });

    res.status(200).json(accounts);
  }
);

// @desc   Deposit funds into a given account
// @route  PUT /api/v1/accounts/:_id/deposit
// @access Private
export const depositFunds = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    const { cantidad } = req.body;

    if (cantidad < 2)
      return next(new ErrorResponse("Debe depositar al menos RD$2.00.", 400));

    const accountFound: any = await Cuenta.findById(_id);

    if (!accountFound) return notFound({ entity: "Cuenta", next });

    // Add the provided balance to the existing one
    accountFound.balance_disponible += Number(cantidad);
    accountFound.balance_actual += Number(cantidad);

    await accountFound.save();

    res.status(200).json({
      exito: true,
      mensaje: `RD$${cantidad}.00 fueron depositados satisfactoriamente.`,
    });
  }
);

// @desc   GET account information with its _id
// @route  GET /api/v1/accounts/:_id
// @access Private
export const getAccountDetailsById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const account = await Cuenta.findById(_id);

    if (!account) return notFound({ next, entity: "Cuenta" });

    res.status(200).json(account);
  }
);

// @desc   Display transaction history of a given account
// @route  GET /api/v1/accounts/:_id/transactions
// @access Private
export const transactionHistory = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { account } = req.params;

    const transactions = await Transaccion.find({ account });

    res.status(200).json(transactions);
  }
);

// @desc   Get user details by a given account number
// @route  GET /api/v1/accounts/:_account_no/user-details
// @access Private
export const getUserDetailsByAccountNo = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { numero_de_cuenta } = req.params;

    const account: any = await Cuenta.findOne({ numero_de_cuenta });

    if (!account) return notFound({ next, entity: "Cuenta" });

    const user = await Usuario.findById(account.usuario);

    if (!user) return notFound({ next, entity: "Usuario" });

    res.status(200).json(user);
  }
);

// @desc   Transfer funds to one of the user's accounts
// @route  PUT /api/v1/accounts/:_id/personal-transfer
// @access Private
export const transferToMyself = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* accountId */ } = req.params;
    const { usuario_id, destinatario_numero_de_cuenta, cantidad } = req.body;

    const areFieldsInvalid: string | undefined = validateAccProvidedFields(req);

    if (areFieldsInvalid)
      return next(new ErrorResponse(areFieldsInvalid!, 400));

    const sender: any = await Usuario.findById(usuario_id);

    if (!sender) return notFound({ entity: "Remitente", next });

    // Find account by the provided account number
    const receiverAcc: any = await Cuenta.findOne({
      numero_de_cuenta: destinatario_numero_de_cuenta,
    });

    if (!receiverAcc)
      return notFound({
        message: "No se encontró la cuenta del destinatario.",
        next,
      });

    const senderAcc: any = await Cuenta.findById(_id);

    const areAccountsInvalid: string | undefined = validateAccounts(
      usuario_id,
      senderAcc,
      receiverAcc
    );

    if (areAccountsInvalid)
      return next(new ErrorResponse(areAccountsInvalid!, 400));

    const amountToTransfer: number = Number(cantidad);

    // Make sure the user has enough funds to perform the transfer
    const notEnoughFunds: string | undefined = checkBalance(
      amountToTransfer,
      senderAcc
    );

    if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

    transferFunds(senderAcc, receiverAcc, amountToTransfer);

    // getTransactionObjs() returns the objects from which the transactions will be created
    const [transactionFrom, transactionTo]: Array<Object> = getTransactionObjs({
      req,
      senderAcc,
      receiverAcc,
      sender,
      receiver: sender,
    });

    const newTransactionFrom: any = await Transaccion.create(transactionFrom);
    const newTransactionTo: any = await Transaccion.create(transactionTo);

    senderAcc.transacciones.push(newTransactionFrom._id);
    receiverAcc.transacciones.push(newTransactionTo._id);

    await senderAcc.save();
    await receiverAcc.save();

    res.status(200).json({
      exito: true,
      mensaje: `RD$${amountToTransfer} fueron transferidos satisfactoriamente.`,
      no_aprobacion: undefined, // TODO: Generate approval number,
      cantidad: cantidad,
      impuesto: "RD$10.00",
    });
  }
);

// @desc   Transfer funds to a third party within the same bank
// @route  PUT /api/v1/accounts/:_id/third-party-transfer
// @access Private
export const sameBankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* account_id */ } = req.params;
    const { usuario_id, destinatario_numero_de_cuenta, cantidad } = req.body;

    const areFieldsInvalid: string | undefined = validateAccProvidedFields(req);

    if (areFieldsInvalid)
      return next(new ErrorResponse(areFieldsInvalid!, 400));

    const sender: any = await Usuario.findById(usuario_id);

    if (!sender) return notFound({ entity: "Remitente", next });

    const senderAcc: any = await Cuenta.findById(_id);

    if (!senderAcc)
      return notFound({
        message: "No se encontró la cuenta del destinatario.",
        next,
      });

    const receiverAcc: any = await Cuenta.findOne({
      numero_de_cuenta: destinatario_numero_de_cuenta,
    });

    if (!receiverAcc)
      return notFound({
        message: "La cuenta del destinatario no pertenece a este banco.",
        next,
      });

    const isTransferPersonal = validateSameBankTransfer(sender, receiverAcc);

    if (isTransferPersonal)
      return next(new ErrorResponse(isTransferPersonal!, 400));

    // Locate receiver by its associated user_id
    const receiver = await Usuario.findById((receiverAcc as any).usuario);

    if (!receiver)
      return notFound({
        message: "No se pudo encontrar al destinatario.",
        next,
      });

    const amountToTransfer: number = Number(cantidad);

    const notEnoughFunds: string | undefined = checkBalance(
      amountToTransfer,
      senderAcc
    );

    if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

    transferFunds(senderAcc, receiverAcc, amountToTransfer);

    // getTransactionObjs() returns the objects from which the transactions will be created
    const [transactionFrom, transactionTo]: Array<Object> = getTransactionObjs({
      req,
      senderAcc,
      receiverAcc,
      sender,
      receiver,
    });

    const newTransactionFrom: any = await Transaccion.create(transactionFrom);
    const newTransactionTo: any = await Transaccion.create(transactionTo);

    senderAcc.transacciones.push(newTransactionFrom._id);
    receiverAcc.transacciones.push(newTransactionTo._id);

    await senderAcc.save();
    await receiverAcc.save();

    res.status(200).json({
      exito: true,
      mensaje: `RD$${amountToTransfer}.00 fueron transferidos satisfactoriamente!`,
      aprobacion_no: undefined, // TODO: Generate approval number,
      cantidad: `RD$${amountToTransfer}.00`,
      impuesto: "RD$10.00",
    });
  }
);

// @desc   Transfer funds to an account outside of this bank
// @route  PUT /api/v1/accounts/:_id/interbank-transfer
// @access Private
export const interbankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* account_id */ } = req.params;
    const {
      usuario_id,
      destinatario_banco,
      destinatario_cedula,
      destinatario_nombre,
      destinatario_numero_de_cuenta,
      cantidad,
    } = req.body;

    const areFieldsInvalid: string | undefined = validateAccProvidedFields(
      req,
      true
    );

    if (areFieldsInvalid)
      return next(new ErrorResponse(areFieldsInvalid!, 400));

    const sender: any = await Usuario.findById(usuario_id);

    if (!sender) return notFound({ entity: "Remitente", next });

    const senderAcc: any = await Cuenta.findById(_id);

    if (!senderAcc)
      return notFound({
        message: "No se encontró la cuenta del remitente.",
        next,
      });

    const invalidAccount = await Cuenta.findOne({
      numero_de_cuenta: destinatario_numero_de_cuenta,
    });

    if (invalidAccount) return invalidInterbankTransfer(next);

    const amountToTransfer: number = Number(cantidad);

    // Make sure the user has enough funds to perform the transfer
    const notEnoughFunds: string | undefined = checkBalance(
      amountToTransfer,
      senderAcc
    );

    if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

    processInterbankTransfer(senderAcc, amountToTransfer);

    const transactionObj = getTransferTransactionObj(req);

    const newTransaction = await Transaccion.create(transactionObj);

    senderAcc.transacciones.push(newTransaction._id);

    await senderAcc.save();

    res.status(200).json({
      exito: true,
      mensaje: `RD$${amountToTransfer}.00 fueron transferidos satisfactoriamente.`,
      destinatario_banco,
      destinatario_cedula,
      destinatario_nombre,
      no_aprobacion: undefined, // TODO: Generate approval number,
      cantidad: `RD$${amountToTransfer}.00`,
      impuesto: "RD$10.00",
    });
  }
);
