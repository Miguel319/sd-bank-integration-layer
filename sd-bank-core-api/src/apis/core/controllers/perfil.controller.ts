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
      const { rol, descripcion, tipo_entidad_asociada } = req.body;

      const perfilACrear = {
        rol,
        descripcion,
        tipo_entidad_asociada,
      };

      await Perfil.create([perfilACrear], { session });

      await session.commitTransaction();

      res.status(201).json({
        exito: true,
        mensaje: "¡Perfil agregado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
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

      const perfilEncontrado: any = await Perfil.findById(_id).session(session);

      if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

      const perfilActualizado = {
        descripcion: descripcion || perfilEncontrado.descripcion,
        rol: rol || perfilEncontrado.rol,
        tipo_entidad_asociada: perfilEncontrado.tipo_entidad_asociada,
      };

      await Perfil.updateOne(perfilEncontrado, perfilActualizado, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Perfil actualizado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
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

      const perfilEncontrado = await Perfil.findById(_id).session(session);

      if (!perfilEncontrado) return notFound({ entity: "Perfil", next });

      const usuariosAsociados: any = await Usuario.find({
        perfil: perfilEncontrado._id,
      }).session(session);

      if (usuariosAsociados.length > 0)
        return next(
          new ErrorResponse(
            "No puede eliminar este perfil porque tiene usuarios asociados.",
            400
          )
        );

      await Perfil.deleteOne(perfilEncontrado, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Perfil eliminado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
