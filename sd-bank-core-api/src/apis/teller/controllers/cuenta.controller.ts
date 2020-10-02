import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { ClientSession, startSession } from "mongoose";
import Cliente from "../../../shared/models/Cliente";
import Cuenta from "../../../shared/models/Cuenta";
import {
  depositarFondos,
  retirarFondosCuenta,
  validarReqDeposito,
} from "../utils/cuenta.helpers";
import { notFound } from "../../../shared/utils/err.helpers";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import Transaccion from "../../../shared/models/Transaccion";
import ErrorResponse from "../../../shared/utils/error-response";
import { checkBalanceRetiro } from "../utils/cuenta.helpers";
import {
  getTransaccionACrear,
  validarReqRetiro,
} from "../utils/cuenta.helpers";
import Cajero from "../../../shared/models/Cajero";
import Cuadre from "../../../shared/models/Cuadre";
import OperacionCajero from "../../../shared/models/OperacionCajero";
import { Types } from "mongoose";
import TipoDeTransaccion from "../../../shared/models/TipoDeTransaccion";

// @desc     Cashier process withdraw from cliente
// @route    PUT
// @access   private
export const processCuentaRetiro = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    const { numero_de_cuenta } = req.params;
    const { cajero_id, cuadre_id } = req.query;
    const { monto } = req.body;

    try {
      session.startTransaction();

      const datosInvalidos: any = validarReqRetiro(req);

      if (datosInvalidos) return next(new ErrorResponse(datosInvalidos, 400));

      const montoARetirar: number = Number(monto);

      if (!montoARetirar || montoARetirar < 0)
        return next(
          new ErrorResponse(
            "El monto debe ser un valor numérico positivo.",
            400
          )
        );

      const cajeroAsociado: any = await Cajero.findById(cajero_id).session(
        session
      );

      if (!cajeroAsociado)
        return notFound({
          message: "No se halló ningún cajero con el _id provisto.",
          next,
        });

      const cuadreAsociado: any = await Cuadre.findById(cuadre_id).session(
        session
      );

      if (!cuadreAsociado)
        return notFound({
          message: "No se halló ningún cuadre con el _id provisto.",
          next,
        });

      const cuentaEncontrada: any = await Cuenta.findOne({
        numero_de_cuenta,
      }).session(session);

      if (!cuentaEncontrada)
        return notFound({
          message: "No se halló ninguna cuenta con el id provisto.",
          next,
        });

      const montoFormat: string = montoARetirar.toLocaleString();

      const retiroInvalido = checkBalanceRetiro(
        cuentaEncontrada,
        monto,
        montoFormat
      );

      if (retiroInvalido) return next(new ErrorResponse(retiroInvalido, 400));

      retirarFondosCuenta(cuentaEncontrada, montoARetirar);

      const tipoTrans: any = await TipoDeTransaccion.findOne({
        tipo: "Retiro",
      }).session(session);

      const transaccionACrear = getTransaccionACrear(
        cuentaEncontrada,
        montoARetirar,
        tipoTrans
      );

      const transaccionRealizada: any = await Transaccion.create(
        [transaccionACrear],
        { session }
      );

      cuentaEncontrada.transacciones.push(transaccionRealizada[0]._id);

      const operacionCajeroObj: any = {
        cajero: cajeroAsociado._id,
        descripcion: `El cajero ${cajeroAsociado.nombre} ${
          cajeroAsociado.apellido
        } procesó un retiro de RD$${montoARetirar.toLocaleString()} en la cuenta ${
          cuentaEncontrada.numero_de_cuenta
        }`,
        tipo: "Retiro",
        monto: montoARetirar,
        cuadre: cuadreAsociado._id,
      };

      const operacionRealizada: any = await OperacionCajero.create(
        [operacionCajeroObj],
        { session }
      );

      cuadreAsociado.operaciones.push(operacionRealizada[0]._id);
      cuadreAsociado.monto_depositado -= montoARetirar;
      cuadreAsociado.balance_final -= montoARetirar;
      cuadreAsociado.clientes_atendidos += 1;

      await cuadreAsociado.save();

      await cuentaEncontrada.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se retiraron RD$${montoFormat} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const getCuentasFromClienteCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { cedula } = req.params;

    const clienteEncontrado = await Cliente.findOne({ cedula });

    if (!clienteEncontrado)
      return notFound({
        message: "No se encontó ningún cliente con la cédula provista.",
        next,
      });

    const cuentasDelCliente = await Cuenta.find({
      cliente: clienteEncontrado._id,
    });

    res.status(200).json(cuentasDelCliente);
  }
);

export const processCuentaDeposito = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { numero_de_cuenta } = req.params;
    const { cajero_id, cuadre_id } = req.query;
    const { monto } = req.body;

    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const peticionInvalida = validarReqDeposito(req);

      if (peticionInvalida)
        return next(new ErrorResponse(peticionInvalida, 400));

      const cajeroAsociado: any = await Cajero.findById(cajero_id).session(
        session
      );

      if (!cajeroAsociado)
        return notFound({
          message: "No se halló ningún cajero con el _id provisto.",
          next,
        });

      const cuadreAsociado: any = await Cuadre.findById(cuadre_id).session(
        session
      );

      if (!cuadreAsociado)
        return notFound({
          message: "No se halló ningún cuadre con el _id provisto.",
          next,
        });

      const cuentaEncontrada: any = await Cuenta.findOne({
        numero_de_cuenta,
      }).session(session);

      if (!cuentaEncontrada)
        return notFound({
          message:
            "No se halló ninguna cuenta con el número provisto provisto.",
          next,
        });

      const montoADepositar: number = Number(monto);

      depositarFondos(cuentaEncontrada, montoADepositar);

      const tipoTrans: any = await TipoDeTransaccion.findOne({
        tipo: "Depósito",
      }).session(session);

      const transaccionACrear = getTransaccionACrear(
        cuentaEncontrada,
        montoADepositar,
        tipoTrans
      );

      const transaccionRealizada: any = await Transaccion.create(
        [transaccionACrear],
        { session }
      );

      cuentaEncontrada.transacciones.push(transaccionRealizada[0]._id);

      const cajeroIdRef: any = cajero_id;

      const operacionCajeroObj: any = {
        cajero: cajeroIdRef as Types.ObjectId,
        descripcion: `El cajero ${cajeroAsociado.nombre} ${
          cajeroAsociado.apellido
        } procesó un despósito de RD$${montoADepositar.toLocaleString()} en la cuenta ${
          cuentaEncontrada.numero_de_cuenta
        }`,
        tipo: "Deposito",
        monto: montoADepositar,
        cuadre: cuadreAsociado._id,
      };

      const operacionRealizada: any = await OperacionCajero.create(
        [operacionCajeroObj],
        { session }
      );

      cuadreAsociado.operaciones.push(operacionRealizada[0]._id);
      cuadreAsociado.monto_depositado += montoADepositar;
      cuadreAsociado.balance_final += montoADepositar;
      cuadreAsociado.clientes_atendidos += 1;

      await cuadreAsociado.save();

      await cuentaEncontrada.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se depositaron RD$${montoADepositar.toLocaleString()} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
