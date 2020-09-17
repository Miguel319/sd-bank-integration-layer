import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middlewares/async.middleware";
import ErrorResponse from "../utils/error-response";
import Prestamo from "../models/Prestamo";
import Cliente from "../models/Cliente";
import { notFound } from "../utils/err.helpers";

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
    const { descripcion, cantidad_total, usuario_id } = req.body;

    const newPrestamo = {
      descripcion,
      cantidad_total,
      remaining: Number(cantidad_total),
      cliente: usuario_id,
    };

    const clientFound: any = await Cliente.findById(usuario_id);

    if (!clientFound) return notFound({ entity: "Cliente", next });

    const prestamo = await Prestamo.create(newPrestamo);

    clientFound.prestamos.push((prestamo as any).id);

    await clientFound.save();

    res.status(201).json({
      exito: true,
      mensaje: "Préstamo solicitado y aprobado exitosamente.",
    });
  }
);

// @desc   Update prestamo by ID
// @route  PUT /api/v1/prestamos/:_id
// @access Private
export const updatePrestamo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { descripcion } = req.params;

    if (!descripcion)
      return next(
        new ErrorResponse("Debe proveer una descripción para el préstamo.", 400)
      );

    const prestamo = await Prestamo.findById(_id);

    if (!prestamo) return notFound({ entity: "Préstamo", next });

    await Prestamo.updateOne(prestamo, { descripcion });

    res.status(200).json({
      exito: true,
      mensaje: "¡Préstamo actualizado satisfactoriamente!",
    });
  }
);
