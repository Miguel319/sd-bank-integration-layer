import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import Cliente from "../../../shared/models/Cliente";
import Cuenta from "../../../shared/models/Cuenta";
import { startSession, ClientSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import Transaccion from "../../../shared/models/Transaccion";
import {
  checkBalance,
  getTransactionObjs,
  getTransferTransactionObj,
  invalidInterbankTransfer,
  processInterbankTransfer,
  transferFunds,
  validateAccounts,
  validateAccProvidedFields,
  validateSameBankTransfer,
} from "../utils/cuenta.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { notFound } from '../../../shared/utils/err.helpers';

// @desc   Get all cuentas
// @route  GET /api/v1/cuentas
// @access Private
export const getAllAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const cuentas = await Cuenta.find({});

    res.status(200).json(cuentas);
  }
);

// @desc   Display the cuentas from a given usuario by searching for his/her id
// @route  GET /api/v1/cuentas/usuario/:_id
// @access Private
export const getUserAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const usuarioFound: any = await Cliente.findById(_id);

    if (!usuarioFound) return notFound({ message: "Cliente", next });

    const cuentas = await Cuenta.find({ _id: usuarioFound._id });

    res.status(200).json(cuentas);
  }
);

// @desc   Deposit funds into a given cuenta
// @route  PUT /api/v1/cuentas/:_id/deposit
// @access Private
export const depositFunds = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;
      const { cantidad } = req.body;

      if (cantidad < 2)
        return next(new ErrorResponse("Debe depositar al menos RD$2.00.", 400));

      const cuentaFound: any = await Cuenta.findById(_id);

      if (!cuentaFound) return notFound({ entity: "Cuenta", next });

      // Add the provided balance to the existing one
      cuentaFound.balance_disponible += Number(cantidad);
      cuentaFound.balance_actual += Number(cantidad);

      await cuentaFound.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${cantidad}.00 fueron depositados satisfactoriamente.`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

// @desc   GET cuenta information with its _id
// @route  GET /api/v1/cuentas/:_id
// @access Private
export const getAccountDetailsById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const cuenta = await Cuenta.findById(_id);

    if (!cuenta) return notFound({ next, entity: "Cuenta" });

    res.status(200).json(cuenta);
  }
);

// @desc   Display transaction history of a given cuenta
// @route  GET /api/v1/cuentas/:_id/transactions
// @access Private
export const transactionHistory = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cuenta } = req.params;

    const transactions = await Transaccion.find({ cuenta });

    res.status(200).json(transactions);
  }
);

// @desc   Get usuario details by a given cuenta number
// @route  GET /api/v1/cuentas/:_cuenta_no/usuario-details
// @access Private
export const getUserDetailsByAccountNo = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { numero_de_cuenta } = req.params;

    const cuenta: any = await Cuenta.findOne({ numero_de_cuenta });

    if (!cuenta) return notFound({ next, entity: "Cuenta" });

    const usuario = await Cliente.findById(cuenta.cliente);

    if (!usuario) return notFound({ next, entity: "Cliente" });

    res.status(200).json(usuario);
  }
);

// @desc   Transfer funds to one of the usuario's cuentas
// @route  PUT /api/v1/cuentas/:_id/personal-transfer
// @access Private
export const transferToMyself = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { _id /* cuentaId */ } = req.params;
      const { cliente_id, destinatario_numero_de_cuenta, cantidad } = req.body;

      const areFieldsInvalid: string | undefined = validateAccProvidedFields(
        req
      );

      if (areFieldsInvalid)
        return next(new ErrorResponse(areFieldsInvalid!, 400));

      const sender: any = await Cliente.findById(cliente_id).session(session);

      if (!sender) return notFound({ entity: "Remitente", next });

      // Find cuenta by the provided cuenta number
      const receiverAcc: any = await Cuenta.findOne({
        numero_de_cuenta: destinatario_numero_de_cuenta,
      }).session(session);

      if (!receiverAcc)
        return notFound({
          message: "No se encontró la cuenta del destinatario.",
          next,
        });

      const senderAcc: any = await Cuenta.findById(_id).session(session);

      const areAccountsInvalid: string | undefined = validateAccounts(
        cliente_id,
        senderAcc,
        receiverAcc
      );

      if (areAccountsInvalid)
        return next(new ErrorResponse(areAccountsInvalid!, 400));

      const amountToTransfer: number = Number(cantidad);

      // Make sure the usuario has enough funds to perform the transfer
      const notEnoughFunds: string | undefined = checkBalance(
        amountToTransfer,
        senderAcc
      );

      if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

      transferFunds(senderAcc, receiverAcc, amountToTransfer);

      // getTransactionObjs() returns the objects from which the transactions will be created
      const [
        transactionFrom,
        transactionTo,
      ]: Array<Object> = getTransactionObjs({
        req,
        senderAcc,
        receiverAcc,
        sender,
        receiver: sender,
      });

      const newTransactionFrom: any = await Transaccion.create(
        [transactionFrom],
        { session }
      );
      const newTransactionTo: any = await Transaccion.create([transactionTo], {
        session,
      });

      senderAcc.transacciones.push(newTransactionFrom._id);
      receiverAcc.transacciones.push(newTransactionTo._id);

      await senderAcc.save();
      await receiverAcc.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${amountToTransfer} fueron transferidos satisfactoriamente.`,
        no_aprobacion: undefined, // TODO: Generate approval number,
        cantidad: cantidad,
        impuesto: "RD$10.00",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

// @desc   Transfer funds to a third party within the same bank
// @route  PUT /api/v1/cuentas/:_id/third-party-transfer
// @access Private
export const sameBankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = await startSession();

    try {
      session.startTransaction();
      const { _id /* cuenta_id */ } = req.params;
      const { cliente_id, destinatario_numero_de_cuenta, cantidad } = req.body;

      const areFieldsInvalid: string | undefined = validateAccProvidedFields(
        req
      );

      if (areFieldsInvalid)
        return next(new ErrorResponse(areFieldsInvalid!, 400));

      const sender: any = await Cliente.findById(cliente_id).session(session);

      if (!sender) return notFound({ entity: "Remitente", next });

      const senderAcc: any = await Cuenta.findById(_id).session(session);

      if (!senderAcc)
        return notFound({
          message: "No se encontró la cuenta del destinatario.",
          next,
        });

      const receiverAcc: any = await Cuenta.findOne({
        numero_de_cuenta: destinatario_numero_de_cuenta,
      }).session(session);

      if (!receiverAcc)
        return notFound({
          message: "La cuenta del destinatario no pertenece a este banco.",
          next,
        });

      const isTransferPersonal = validateSameBankTransfer(sender, receiverAcc);

      if (isTransferPersonal)
        return next(new ErrorResponse(isTransferPersonal!, 400));

      // Locate receiver by its associated usuario_id
      const receiver = await Cliente.findById((receiverAcc as any).cliente);

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
      const [
        transactionFrom,
        transactionTo,
      ]: Array<Object> = getTransactionObjs({
        req,
        senderAcc,
        receiverAcc,
        sender,
        receiver,
      });

      const newTransactionFrom: any = await Transaccion.create(
        [transactionFrom],
        { session }
      );
      const newTransactionTo: any = await Transaccion.create([transactionTo], {
        session,
      });

      senderAcc.transacciones.push(newTransactionFrom._id);
      receiverAcc.transacciones.push(newTransactionTo._id);

      await senderAcc.save();
      await receiverAcc.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${amountToTransfer}.00 fueron transferidos satisfactoriamente!`,
        aprobacion_no: undefined, // TODO: Generate approval number,
        cantidad: `RD$${amountToTransfer}.00`,
        impuesto: "RD$10.00",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

// @desc   Transfer funds to an cuenta outside of this bank
// @route  PUT /api/v1/cuentas/:_id/interbank-transfer
// @access Private
export const interbankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { _id /* cuenta_id */ } = req.params;
      const {
        cliente_id,
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

      const sender: any = await Cliente.findById(cliente_id).session(session);

      if (!sender) return notFound({ entity: "Remitente", next });

      const senderAcc: any = await Cuenta.findById(_id).session(session);

      if (!senderAcc)
        return notFound({
          message: "No se encontró la cuenta del remitente.",
          next,
        });

      const invalidAccount = await Cuenta.findOne({
        numero_de_cuenta: destinatario_numero_de_cuenta,
      }).session(session);

      if (invalidAccount) return invalidInterbankTransfer(next);

      const amountToTransfer: number = Number(cantidad);

      // Make sure the usuario has enough funds to perform the transfer
      const notEnoughFunds: string | undefined = checkBalance(
        amountToTransfer,
        senderAcc
      );

      if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

      processInterbankTransfer(senderAcc, amountToTransfer);

      const transactionObj = getTransferTransactionObj(req);

      const newTransaction = await Transaccion.create([transactionObj], {
        session,
      });

      senderAcc.transacciones.push(newTransaction._id);

      await senderAcc.save();

      await session.commitTransaction();
      session.endSession();

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
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);
