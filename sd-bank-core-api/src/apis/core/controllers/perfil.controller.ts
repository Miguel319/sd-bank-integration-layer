import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { notFound } from "../../../shared/utils/err.helpers";
import Perfil from "../../../shared/models/Perfil";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { ClientSession, startSession } from "mongoose";
import Usuario from "../../../shared/models/Usuario";
import ErrorResponse from "../../../shared/utils/error-response";

// @desc   Create perfil
// @route  POST /api/v1/perfiles
// @access Private
export const createPerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { rol, descripcion } = req.body;

      const perfilACrear = {
        rol,
        descripcion,
      };

      await Perfil.create(perfilACrear);

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        exito: true,
        mensaje: "¡Perfil agregado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
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
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { _id } = req.params;
      const { descripcion, rol } = req.body;

      const perfilEncontrado = await Perfil.findById(_id);

      if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

      const perfilActualizado = { descripcion, rol };

      await Perfil.updateOne(perfilEncontrado, perfilActualizado);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "¡Perfil actualizado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

// @desc   Delete perfil by id
// @route  DELETE /api/v1/perfiles/:_id
// @access Private
export const deletePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { _id } = req.params;

      const perfilEncontrado = await Perfil.findById(_id);

      if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

      const usuarioAsociado: any = Usuario.findOne({
        perfil: perfilEncontrado._id,
      });

      if (usuarioAsociado)
        return next(
          new ErrorResponse(
            "No puede eliminar este perfil debido a que está asociado a un usuario.",
            400
          )
        );

      await Perfil.deleteOne(perfilEncontrado);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "¡Perfil eliminado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);
