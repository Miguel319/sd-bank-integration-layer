import { errorHandler } from "./../../../shared/middlewares/error.middleware";
import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Prestamo from "../../../shared/models/Prestamo";
import Cliente from "../../../shared/models/Cliente";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { ClientSession, startSession } from "mongoose";

// @desc   GET prestamos
// @route  POST /api/v1/prestamos
// @access Private
export const getAllPrestamos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const prestamos = await Prestamo.find({});

    res.status(200).json(prestamos);
  }
);

// @desc   GET prestamo by client ID
// @route  POST /api/v1/prestamos/client/:_id
// @access Private
export const getPrestamoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const prestamo = await Prestamo.findOne({ _id });

    if (!prestamo) return notFound({ entity: "Préstamo", next });

    res.status(200).json(prestamo);
  }
);

// @desc   Create prestamo by client ID
// @route  POST /api/v1/prestamos/client/:_id
// @access Private
export const getAllPrestamosByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cliente_id } = req.params;

    const client = await Cliente.findById(cliente_id);

    if (!client) return notFound({ entity: "Cliente", next });

    const prestamos = await Prestamo.find({ client });
    res.status(200).json(prestamos);
  }
);

// @desc   Create prestamo
// @route  POST /api/v1/prestamos
// @access Private
export const createPrestamo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { descripcion, cantidad_total, cliente_id } = req.body;

      const newPrestamo = {
        descripcion,
        cantidad_total,
        remaining: Number(cantidad_total),
        cliente: cliente_id,
        cantidad_restante: Number(cantidad_total),
      };

      const clientFound: any = await Cliente.findById(cliente_id).session(
        session
      );

      if (!clientFound) return notFound({ entity: "Cliente", next });

      const prestamoCreado: any = await Prestamo.create([newPrestamo], {
        session,
      });

      clientFound.prestamos.push(prestamoCreado[0]._id);

      await clientFound.save();

      await session.commitTransaction();

      res.status(201).json({
        exito: true,
        mensaje: "Préstamo solicitado y aprobado exitosamente.",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

// @desc   Update prestamo by ID
// @route  PUT /api/v1/prestamos/:_id
// @access Private
export const updatePrestamo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;
      const { descripcion } = req.params;

      if (!descripcion)
        return next(
          new ErrorResponse(
            "Debe proveer una descripción para el préstamo.",
            400
          )
        );

      const prestamo: any = await Prestamo.findById(_id).session(session);

      if (!prestamo) return notFound({ entity: "Préstamo", next });

      const prestamoActualizado = {
        cantidad_saldada: prestamo.cantidad_saldada,
        cantidad_total: prestamo.cantidad_total,
        cantidad_restante: prestamo.cantidad_restante,
        descripcion,
        aprobado: prestamo.aprobado,
      };

      await Prestamo.updateOne(prestamo, prestamoActualizado, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Préstamo actualizado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
