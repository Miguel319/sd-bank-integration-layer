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
import { notFound } from "../../../shared/utils/err.helpers";
import TipoDeTransaccion from "../../../shared/models/TipoDeTransaccion";
import { agregarSDBankBeneficiario } from "../utils/cuenta.helpers";
import Beneficiario from "../../../shared/models/Beneficiario";
import { agregarBeneficiarioInterbancario } from "../utils/cuenta.helpers";

// @desc   Display the cuentas from a given usuario by searching for his/her id
// @route  GET /api/v1/cuentas/usuario/:_id
// @access Private
export const getClienteCuentasByClienteId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const usuarioFound: any = await Cliente.findById(_id);

    if (!usuarioFound) return notFound({ message: "Cliente", next });

    const cuentas = await Cuenta.find({ cliente: usuarioFound._id });

    res.status(200).json(cuentas);
  }
);

export const getCuentaAndClienteByAccountNumber = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id, numero_de_cuenta } = req.params;

    const remitente = await Cliente.findById(_id);

    if (!remitente)
      return notFound({
        message: "No se halló ningún cliente con el _id provisto.",
        next,
      });

    const cuenta: any = await Cuenta.findOne({ numero_de_cuenta });

    if (!cuenta)
      return notFound({
        message: "No se halló ninguna cuenta con el número provisto.",
        next,
      });

    const destinatario = await Cliente.findById(cuenta.cliente);

    if (!destinatario)
      return notFound({
        message: "No se halló ningún cliente con el _id provisto.",
        next,
      });

    if (String(remitente._id) === String(destinatario._id))
      return next(
        new ErrorResponse(
          "No puede elegir una cuenta suya. La cuenta debe ser de alguien más.",
          400
        )
      );

    res.status(200).json({
      cuenta,
      cliente: destinatario,
    });
  }
);

// @desc   Display the cuentas from a given usuario by searching for his/her id
// @route  GET /api/v1/cuentas/usuario/:_id
// @access Private
export const getClienteCuentasByClienteCedula = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula } = req.params;

    const usuarioFound: any = await Cliente.findOne({ cedula });

    if (!usuarioFound) return notFound({ message: "Cliente", next });

    const cuentas = await Cuenta.find({ cliente: usuarioFound._id });

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
    const { _id } = req.params;

    const transactions = await Transaccion.find({ entidad_asociada: _id });

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

export const getBeneficiariosFromCuenta = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const beneficiarios: any = await Beneficiario.find({ cuenta_cliente: _id });

    res.status(200).json(beneficiarios);
  }
);

export const getBeneficiariosMismoBanco = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const beneficiarios: any = await Beneficiario.find({ cuenta_cliente: _id });

    const beneficiariosRes: Array<any> = [];

    for (const beneficiario of beneficiarios) {
      const cuentaEncontrada = await Cuenta.findOne({
        numero_de_cuenta: beneficiario.cuenta_beneficiario,
      });

      if (cuentaEncontrada) beneficiariosRes.push(beneficiario);
    }

    res.status(200).json(beneficiariosRes);
  }
);

export const getInterbankTransferBeneficiarios = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const cuenta: any = await Cuenta.findById(_id);

    if (!cuenta)
      return notFound({
        message: "No se halló ninguna cuenta con el _id provisto.",
        next,
      });

    const beneficiarios: any = await Beneficiario.find({
      cuenta_cliente: cuenta._id,
    });

    let beneficiarioRes: Array<any> = [];

    for (const beneficiario of beneficiarios) {
      const cuentaEncontrada = await Cuenta.findOne({
        numero_de_cuenta: beneficiario.cuenta_beneficiario,
      });

      if (!cuentaEncontrada) beneficiarioRes.push(beneficiario);
    }

    res.status(200).json(beneficiarioRes);
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

      const { numero_de_cuenta } = req.params;
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

      const senderAcc: any = await Cuenta.findOne({ numero_de_cuenta }).session(
        session
      );

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

      const senderInitialBalance: number = senderAcc.balance_disponible;
      const receiverInitialBalance: number = receiverAcc.balance_disponible;

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

      const tipoDeTransaccion: any = await TipoDeTransaccion.findOne({
        tipo: "Transferencia propia",
      }).session(session);

      const newTransactionFrom: any = await Transaccion.create(
        [
          {
            ...transactionFrom,
            tipo: tipoDeTransaccion._id,
            balance_anterior: senderInitialBalance,
          },
        ],
        { session }
      );
      const newTransactionTo: any = await Transaccion.create(
        [
          {
            ...transactionTo,
            tipo: tipoDeTransaccion._id,
            balance_anterior: receiverInitialBalance,
          },
        ],
        { session }
      );

      senderAcc.transacciones.push(newTransactionFrom[0]._id);
      receiverAcc.transacciones.push(newTransactionTo[0]._id);

      await senderAcc.save();
      await receiverAcc.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${amountToTransfer} fueron transferidos satisfactoriamente.`,
        cantidad: cantidad,
        impuesto: "RD$10.00",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
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
      const {
        cliente_id,
        destinatario_numero_de_cuenta,
        cantidad,
        agregar_beneficiario,
        beneficiario_id,
      } = req.body;

      if (agregar_beneficiario && beneficiario_id)
        return next(
          new ErrorResponse(
            "No puede mandar 'agregar_beneficiario' y 'beneficiario' en la misma petición.",
            400
          )
        );

      const areFieldsInvalid: string | undefined = validateAccProvidedFields(
        req,
        false,
        Boolean(beneficiario_id)
      );

      if (areFieldsInvalid)
        return next(new ErrorResponse(areFieldsInvalid!, 400));

      let beneficiarioAsociado: any = undefined;

      if (beneficiario_id) {
        beneficiarioAsociado = await Beneficiario.findById(beneficiario_id);

        if (!beneficiarioAsociado)
          return notFound({ entity: "Beneficiario", next });
      }

      const sender: any = await Cliente.findById(cliente_id).session(session);

      if (!sender) return notFound({ entity: "Remitente", next });

      const senderAcc: any = await Cuenta.findById(_id).session(session);

      if (!senderAcc)
        return notFound({
          message: "No se encontró la cuenta del remitente.",
          next,
        });

      const receiverAcc: any = beneficiarioAsociado
        ? await Cuenta.findOne({
            numero_de_cuenta: beneficiarioAsociado.cuenta_beneficiario,
          }).session(session)
        : await Cuenta.findOne({
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
      const receiver: any = beneficiarioAsociado
        ? await Cliente.findOne({ cedula: beneficiarioAsociado.cedula })
        : await Cliente.findById((receiverAcc as any).cliente);

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

      const initialSenderBalance: number = senderAcc.balance_disponible;
      const initialReceiverBalance: number = receiverAcc.balance_disponible;

      transferFunds(senderAcc, receiverAcc, amountToTransfer);

      if (agregar_beneficiario) {
        const beneficiariosAsociados: any = await Beneficiario.find({
          cuenta_cliente: senderAcc._id,
        }).session(session);

        const beneficiarioNoRegistrado = beneficiariosAsociados.find(
          (beneficiarioVal: any) =>
            beneficiarioVal.cuenta_beneficiario === receiverAcc.numero_de_cuenta
        );

        if (!Boolean(beneficiarioNoRegistrado))
          await agregarSDBankBeneficiario({
            receiver,
            receiverAcc,
            sender,
            senderAcc,
            session,
          });
      }

      const tipoDeTransaccion = await TipoDeTransaccion.findOne({
        tipo: "Transferencia a terceros",
      }).session(session);

      if (!tipoDeTransaccion)
        return notFound({
          message: "No se halló el tipo de transferencia especificado.",
          next,
        });

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
        [
          {
            ...transactionFrom,
            tipo: tipoDeTransaccion._id,
            balance_anterior: initialSenderBalance,
          },
        ],
        { session }
      );

      const newTransactionTo: any = await Transaccion.create(
        [
          {
            ...transactionTo,
            tipo: tipoDeTransaccion._id,
            balance_anterior: initialReceiverBalance,
          },
        ],
        {
          session,
        }
      );

      senderAcc.transacciones.push(newTransactionFrom[0]._id);
      receiverAcc.transacciones.push(newTransactionTo[0]._id);

      await senderAcc.save();
      await receiverAcc.save();

      const total: number = amountToTransfer + 10;

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${amountToTransfer.toLocaleString()}.00 fueron transferidos satisfactoriamente!`,
        meta: {
          destinatario_banco: "SD Bank",
          destinatario_cedula: receiver.cedula,
          destinatario_nombre: `${receiver.nombre} ${receiver.apellido}`,
          destinatario_tipo_de_cuenta: receiverAcc.tipo_de_cuenta,
          cantidad: `RD$${amountToTransfer.toLocaleString()}.00`,
          impuesto: "RD$10.00",
          total: `RD$${total.toLocaleString()}`,
        },
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
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
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id /* cuenta_id */ } = req.params;
      const {
        cliente_id,
        destinatario_banco,
        destinatario_cedula,
        destinatario_nombre,
        destinatario_tipo_de_cuenta,
        destinatario_numero_de_cuenta,
        cantidad,
        agregar_beneficiario,
        beneficiario_id,
      } = req.body;

      if (agregar_beneficiario && beneficiario_id)
        return next(
          new ErrorResponse(
            "No puede mandar 'agregar_beneficiario' y 'beneficiario' en la misma petición.",
            400
          )
        );

      const areFieldsInvalid: string | undefined = validateAccProvidedFields(
        req,
        true,
        Boolean(beneficiario_id)
      );

      if (areFieldsInvalid)
        return next(new ErrorResponse(areFieldsInvalid!, 400));

      let beneficiarioAsociado: any = undefined;

      if (beneficiario_id) {
        beneficiarioAsociado = await Beneficiario.findById(beneficiario_id);

        if (!beneficiarioAsociado)
          return notFound({ entity: "Beneficiario", next });
      }

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

      const initialBalance: number = senderAcc.balance_disponible;

      processInterbankTransfer(senderAcc, amountToTransfer);

      if (agregar_beneficiario) {
        const beneficiariosAsociados: any = await Beneficiario.find({
          cuenta_cliente: senderAcc._id,
        }).session(session);

        const beneficiarioNoRegistrado = beneficiariosAsociados.find(
          (beneficiarioVal: any) =>
            beneficiarioVal.cuenta_beneficiario ===
            destinatario_numero_de_cuenta
        );

        if (!Boolean(beneficiarioNoRegistrado)) {
          const destinatario = {
            destinatario_banco,
            destinatario_cedula,
            destinatario_nombre,
            destinatario_tipo_de_cuenta,
            destinatario_cuenta: destinatario_numero_de_cuenta,
          };

          await agregarBeneficiarioInterbancario({
            session,
            sender,
            senderAcc,
            destinatario,
          });
        }
      }

      const tipoTransaccion = await TipoDeTransaccion.findOne({
        tipo: "Transferencia interbancaria",
      });

      const transactionObj = getTransferTransactionObj(
        req,
        senderAcc,
        beneficiarioAsociado
      );

      const newTransaction: any = await Transaccion.create(
        [
          {
            ...transactionObj,
            tipo: tipoTransaccion!._id,
            balance_anterior: initialBalance,
          },
        ],
        {
          session,
        }
      );

      senderAcc.transacciones.push(newTransaction[0]._id);

      const total: number = amountToTransfer + 10;

      await senderAcc.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${amountToTransfer.toLocaleString()}.00 fueron transferidos satisfactoriamente.`,
        meta: {
          destinatario_banco,
          destinatario_cedula,
          destinatario_nombre,
          destinatario_tipo_de_cuenta,
          cantidad: `RD$${amountToTransfer}.00`,
          impuesto: "RD$10.00",
          total: `RD$${total.toLocaleString()}`,
        },
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const getTipoTransaccionById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const tipoDeTransaccion = await TipoDeTransaccion.findById(_id);

    if (!tipoDeTransaccion)
      return notFound({
        message: "No se halló ningún tipo de transacción con el _id provisto.",
        next,
      });

    res.status(200).json(tipoDeTransaccion);
  }
);

export const getTransaccionById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const transaccion = await Transaccion.findById(_id);

    if (!transaccion)
      return notFound({
        entity: "No se halló ninguna transacción con el _id provisto.",
        next,
      });

    res.status(200).json(transaccion);
  }
);
