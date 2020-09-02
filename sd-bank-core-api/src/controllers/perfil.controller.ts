import { Response, Request, NextFunction } from "express";

import { notFound } from "../utils/err.helpers";
import Perfil from "../models/Perfil";
import { asyncHandler } from "../middlewares/async.middleware";

// @desc   Create perfil
// @route  POST /api/v1/perfiles
// @access Private
export const createPerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rol, descripcion } = req.body;

    const perfilACrear = {
      rol,
      descripcion,
    };

    await Perfil.create(perfilACrear);

    res.status(201).json({
      exito: true,
      mensaje: "¡Perfil agregado satisfactoriamente!",
    });
  }
);

// @desc   Create perfil
// @route  GET /api/v1/perfiles
// @access Private
export const getPerfiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const perfiles = await Perfil.find({});

    res.status(200).json(perfiles);
  }
);

// @desc   GET perfil by ID
// @route  GET /api/v1/perfiles
// @access Private
export const getPerfilPorId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { _id } = req.params;

    const perfil = await Perfil.findById(_id);

    if (!perfil) return notFound({ entity: "Perfil", next });

    res.status(200).json(perfil);
  }
);

// @desc   Update perfil by id
// @route  PUT /api/v1/perfiles/:_id
// @access Private
export const updatePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { _id } = req.params;
    const { descripcion, rol } = req.body;

    const perfilEncontrado = await Perfil.findById(_id);

    if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

    const perfilActualizado = { descripcion, rol };

    await Perfil.updateOne(perfilEncontrado, perfilActualizado);

    res.status(200).json({
      exito: true,
      mensaje: "¡Perfil actualizado satisfactoriamente!",
    });
  }
);

// @desc   Delete perfil by id
// @route  DELETE /api/v1/perfiles/:_id
// @access Private
export const deletePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { _id } = req.params;

    const perfilEncontrado = await Perfil.findById(_id);

    if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

    await Perfil.deleteOne(perfilEncontrado);

    res.status(200).json({
      exito: true,
      mensaje: "¡Perfil eliminado satisfactoriamente!",
    });
  }
);
