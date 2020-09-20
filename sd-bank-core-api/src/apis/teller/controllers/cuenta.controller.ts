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
  getTransaccionDeposito,
  validarReqRetiro,
} from "../utils/cuenta.helpers";

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
    const { monto } = req.body;

    try {
      session.startTransaction();

      const datosInvalidos: any = validarReqRetiro(req);

      if (datosInvalidos) return next(new ErrorResponse(datosInvalidos, 400));

      const cuentaEncontrada = await Cuenta.findOne({ numero_de_cuenta });

      if (!cuentaEncontrada)
        return notFound({
          message: "No se halló ninguna cuenta con el id provisto.",
          next,
        });

      const montoNumber: number = Number(monto);
      const montoFormat: string = montoNumber.toLocaleString();

      const retiroInvalido = checkBalanceRetiro(
        cuentaEncontrada,
        monto,
        montoFormat
      );

      if (retiroInvalido) return next(new ErrorResponse(retiroInvalido, 400));

      retirarFondosCuenta(cuentaEncontrada, montoNumber);

      await cuentaEncontrada.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se retiraron RD$${montoFormat} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
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
    const { monto } = req.body;

    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const peticionInvalida = validarReqDeposito(req);

      if (peticionInvalida)
        return next(new ErrorResponse(peticionInvalida, 400));

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

      const transaccionACrear = getTransaccionDeposito(
        cuentaEncontrada,
        montoADepositar
      );

      await Transaccion.create([transaccionACrear], { session });

      await cuentaEncontrada.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se depositaron RD$${montoADepositar.toLocaleString()} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);
