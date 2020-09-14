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
import { getTransaccionDeposito } from "../utils/cuenta.helpers";

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

    try {
      session.startTransaction();

      const { cedula, _id } = req.params;
      const { monto } = req.body;

      // Aquí no se comprueba si la cédula es válida porque ya hay un middleware que lo valida.
      const cliente: any = await Cliente.findOne({ cedula });

      const cuentaEncontrada = await Cuenta.findById(_id);

      if (!cuentaEncontrada)
        return notFound({
          message: "No se halló ninguna cuenta con el id provisto.",
          next,
        });

      const cuentaCliente = cliente.cuentas.find(
        (cuenta: any) => cuenta === _id
      );

      if (!cuentaCliente)
        return notFound({
          message: "La cuenta provista no pertenece al cliente.",
          next,
        });

      const montoNumber: number = Number(monto);

      retirarFondosCuenta(cuentaEncontrada, montoNumber);

      await cuentaEncontrada.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se retiraron RD$${montoNumber.toLocaleString()} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
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
