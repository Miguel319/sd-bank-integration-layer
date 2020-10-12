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
import Cajero from "../../../shared/models/Cajero";
import Cuadre from "../../../shared/models/Cuadre";
import { getPrestamoOp } from "../utils/cajero.helpers";
import OperacionCajero from "../../../shared/models/OperacionCajero";

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
      const { cajero_id, cuadre_id, cedula } = req.query;
      const { monto } = req.body;

      const montoADepositar: number = Number(monto);

      if (!montoADepositar || montoADepositar < 0)
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

      const cliente: any = await Cliente.findOne({ cedula }).session(session);

      if (!cliente)
        return notFound({
          message: "No se halló ningún cliente con la cédula provista.",
          next,
        });

      const prestamoPerteneceACliente = Boolean(
        cliente.prestamos.find(
          (prestamoId: any) => String(prestamoId) === String(_id)
        )
      );

      if (!prestamoPerteneceACliente)
        return notFound({
          message: `No se halló ningún préstamo perteneciente a ${cliente.nombre} ${cliente.apellido} con el id provisto.`,
          next,
        });

      const prestamo: any = await Prestamo.findById(_id).session(session);

      if (!prestamo) return notFound({ entity: "Préstamo", next });

      const montoNumber: number = Number(monto);

      const operacionCajeroObj: any = getPrestamoOp(
        cajeroAsociado,
        montoADepositar,
        cuadreAsociado,
        cliente
      );

      const clientesAtendidos: any = Boolean(
        cuadreAsociado.clientes_atendidos.find(
          (el: any) => String(el) === String(cliente._id)
        )
      );

      if (!clientesAtendidos)
        cuadreAsociado.clientes_atendidos.push(cliente._id);

      if (prestamo.cantidad_saldada === prestamo.cantidad_total) {
        await Prestamo.deleteOne(prestamo, { session });

        const idxToDeletePrestamoFrom = cliente.prestamos.indexOf(prestamo._id);

        cliente.prestamos.splice(idxToDeletePrestamoFrom, 1);

        const operacionRealizada: any = await OperacionCajero.create(
          [operacionCajeroObj],
          { session }
        );

        cuadreAsociado.operaciones.push(operacionRealizada[0]._id);
        cuadreAsociado.monto_depositado += montoADepositar;
        cuadreAsociado.balance_final += montoADepositar;

        await cuadreAsociado.save();

        await cliente.save();

        return res.status(200).json({
          exito: true,
          mensaje: "El préstamo fue saldado por completo.",
        });
      }

      const operacionRealizada: any = await OperacionCajero.create(
        [operacionCajeroObj],
        { session }
      );

      cuadreAsociado.operaciones.push(operacionRealizada[0]._id);
      cuadreAsociado.monto_depositado += montoADepositar;
      cuadreAsociado.balance_final += montoADepositar;

      const balanceExcedido = validarMontoPrestamo(montoNumber, prestamo);

      if (balanceExcedido) return next(new ErrorResponse(balanceExcedido, 400));

      realizarCalculosPrestamos(montoNumber, prestamo);

      await cuadreAsociado.save();

      await prestamo.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `RD$${montoNumber} fueron abonados al préstamo satisfactoriamente.`,
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
