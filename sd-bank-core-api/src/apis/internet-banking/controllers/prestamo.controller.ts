import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import Cliente from "../../../shared/models/Cliente";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import Prestamo from "../../../shared/models/Prestamo";

export const getAllPrestamos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const cliente = await Cliente.findById(_id);

    if (!cliente) return notFound({ entity: "Cliente", next });

    const prestamos = await Prestamo.find({ cliente });
    res.status(200).json(prestamos);
  }
);

export const getPrestamoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const prestamo = await Prestamo.findOne({ _id });

    if (!prestamo) return notFound({ entity: "Préstamo", next });

    res.status(200).json(prestamo);
  }
);

export const payPrestamoByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { monto, usuario_id } = req.body;

    const { _id } = req.params;

    const montoNumber = Number(monto);

    const cliente: any = await Cliente.findById(usuario_id);

    if (!cliente) return notFound({ entity: "Cliente", next });

    const clientePrestamos = cliente.prestamos;

    const prestamoBelongsToUser = clientePrestamos.find(
      (x: any) => String(x) === String(_id)
    );

    if (!prestamoBelongsToUser) {
      return next(
        new ErrorResponse(
          "El préstamo provisto no pertenece al usuario actual.",
          404
        )
      );
    }

    const prestamo: any = await Prestamo.findOne({ _id });

    if (!prestamo) {
      return notFound({ entity: "Préstamo", next });
    }

    if (prestamo.cantidad_saldada === prestamo.cantidad_total) {
      await Prestamo.deleteOne({ _id });

      const idxToDeletePrestamoFrom = cliente.prestamos.indexOf(_id);

      cliente.prestamos.splice(idxToDeletePrestamoFrom, 1);

      await cliente.save();

      return res.status(200).json({
        exito: true,
        mensaje: "El préstamo fue saldado por completo.",
      });
    }

    if (montoNumber >= prestamo.total)
      return next(
        new ErrorResponse(
          "No puede exceder la cantidad total del préstamo.",
          400
        )
      );

    if (montoNumber > prestamo.cantidad_restante)
      return next(
        new ErrorResponse(
          "No puede exceder la cantidad restante del préstamo.",
          400
        )
      );

    const updatePaid = prestamo.cantidad_saldada + montoNumber;
    const updateRemaining = prestamo.cantidad_total - updatePaid;

    prestamo.cantidad_saldada = updatePaid;
    prestamo.cantidad_restante = updateRemaining;

    await prestamo.save();

    res.status(200).json({
      exito: true,
      mensaje: "Pago realizado satisfactoriamente.",
    });
  }
);
