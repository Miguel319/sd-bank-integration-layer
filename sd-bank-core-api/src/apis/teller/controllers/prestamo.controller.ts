import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { ClientSession, startSession } from "mongoose";
import Cliente from "../../../shared/models/Cliente";
import Prestamo from "../../../shared/models/Prestamo";
import { notFound } from "../../../shared/utils/err.helpers";
import {
  realizarCalculosPrestamos,
  validarMontoPrestamo,
} from "../utils/prestamo.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { errorHandler } from "../../../shared/middlewares/error.middleware";

export const getPretamosByClienteId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const prestamos = await Prestamo.find({ cliente: _id });

    res.status(200).json(prestamos);
  }
);

// @desc     Cashier processes loan from client
// @route    POST
// @access   private
export const processPrestamoPago = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;
      const { monto, cedula } = req.body;

      // Aquí no se comprueba si la cédula es válida porque ya hay un middleware que lo valida.
      const cliente: any = await Cliente.findOne({ cedula }).session(session);

      if (!cliente)
        return notFound({
          message: "No se halló ningún cliente con la cédula provista.",
          next,
        });

      const prestamoPerteneceACliente = Boolean(
        cliente.prestamos.find((prestamoId: any) => String(prestamoId) === String(_id))
      );

      if (!prestamoPerteneceACliente)
        return notFound({
          message: `No se halló ningún préstamo perteneciente a ${cliente.nombre} ${cliente.apellido} con el id provisto.`,
          next,
        });

      const prestamo: any = await Prestamo.findById(_id).session(session);

      if (!prestamo) return notFound({ entity: "Préstamo", next });

      const montoNumber: number = Number(monto);

      if (prestamo.cantidad_saldada === prestamo.cantidad_total) {
        await Prestamo.deleteOne([prestamo], { session });

        const idxToDeletePrestamoFrom = cliente.prestamos.indexOf(_id);

        cliente.prestamos.splice(idxToDeletePrestamoFrom, 1);

        await cliente.save();

        return res.status(200).json({
          exito: true,
          mensaje: "El préstamo fue saldado por completo.",
        });
      }

      const balanceExcedido = validarMontoPrestamo(montoNumber, prestamo);

      if (balanceExcedido) return next(new ErrorResponse(balanceExcedido, 400));

      realizarCalculosPrestamos(montoNumber, prestamo);

      await prestamo.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${montoNumber} fueron abonados al préstamo satisfactoriamente.`,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);
