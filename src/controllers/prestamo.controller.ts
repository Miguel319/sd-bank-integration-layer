import { asyncHandler } from "../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error-response";
import Prestamo from "../models/Prestamo";
import Usuario from "../models/Usuario";
import { notFound } from "../utils/err.helpers";

export const getLoanById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const loan = await Prestamo.findOne({ _id });

    if (!loan) return notFound({ entity: "Préstamo", next });

    res.status(200).json(loan);
  }
);

export const getAllLoansByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const user = await Usuario.findById(_id);

    if (!user) return notFound({ entity: "Usuario", next });

    const loans = await Prestamo.find({ user });
    res.status(200).json(loans);
  }
);

export const createLoan = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { descripcion, cantidad_total, usuario_id } = req.body;

    const newLoan = {
      descripcion,
      cantidad_total,
      remaining: Number(cantidad_total),
      usuario_id,
    };

    const userFound: any = await Usuario.findById(usuario_id);

    if (!userFound) return notFound({ entity: "User", next });

    const loan = await Prestamo.create(newLoan);

    userFound.prestamos.push((loan as any).id);

    await userFound.save();

    res.status(201).json({
      exito: true,
      mensaje: "Préstamo solicitado y aprobado exitosamente.",
    });
  }
);

export const payLoanByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { monto, usuario_id } = req.body;

    const { _id } = req.params;

    const montoNumber = Number(monto);

    const user: any = await Usuario.findById(usuario_id);

    if (!user) return notFound({ entity: "Usuario", next });

    const userLoans = user.prestamos;

    const loanBelongsToUser = userLoans.find(
      (x: any) => String(x) === String(_id)
    );

    if (!loanBelongsToUser) {
      return next(
        new ErrorResponse(
          "El préstamo provisto no pertenece al usuario actual.",
          404
        )
      );
    }

    const loan: any = await Prestamo.findOne({ _id });

    if (!loan) {
      return notFound({ entity: "Préstamo", next });
    }

    if (loan.cantidad_saldada === loan.cantidad_total) {
      await Prestamo.deleteOne({ _id });

      const idxToDeletePrestamoFrom = user.prestamos.indexOf(_id);

      user.prestamos.splice(idxToDeletePrestamoFrom, 1);

      await user.save();

      return res.status(200).json({
        exito: true,
        mensaje: "El préstamo fue saldado por completo.",
      });
    }

    if (montoNumber >= loan.total)
      return next(
        new ErrorResponse(
          "No puede exceder la cantidad total del préstamo.",
          400
        )
      );

    if (montoNumber > loan.cantidad_restante)
      return next(
        new ErrorResponse(
          "No puede exceder la cantidad restante del préstamo.",
          400
        )
      );

    const updatePaid = loan.cantidad_saldada + montoNumber;
    const updateRemaining = loan.cantidad_total - updatePaid;

    loan.cantidad_saldada = updatePaid;
    loan.cantidad_restante = updateRemaining;

    await loan.save();

    res
      .status(200)
      .json({ exito: true, mensaje: "Pago realizado satisfactoriamente." });
  }
);
