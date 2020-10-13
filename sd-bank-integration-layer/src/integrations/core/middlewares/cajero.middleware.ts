import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { ClientSession, startSession } from "mongoose";
import Cajero from "../../../shared/models/Cajero";
import ErrorResponse from "../../../shared/utils/error-response";
import {
  sendTokenResponse,
  validateRegistration,
} from "../../../shared/utils/auth.helpers";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { notFound } from "../../../shared/utils/err.helpers";
import Usuario from "../../../shared/models/Usuario";
import Perfil from "../../../shared/models/Perfil";
import Sucursal from "../../../shared/models/Sucursal";
import { Types } from "mongoose";
import { Estado } from "../../../shared/utils/estado";

// @desc     a new cashier
// @route    POST
// @access   public
const createCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();

      try {
        session.startTransaction();
        const { cedula, nombre, apellido, sucursal_id } = req.body;

        const cajeroEncontrado = await Cajero.findOne({ cedula }).session(
          session
        );

        if (cajeroEncontrado)
          return next(
            new ErrorResponse("Ya existe un cajero con esas credenciales.", 400)
          );

        const sucursalEncontrada: any = await Sucursal.findById(
          sucursal_id
        ).session(session);

        if (!sucursalEncontrada)
          return notFound({
            message: "No se halló la sucursal provista.",
            next,
          });

        const cajeroToCreate = {
          cedula,
          nombre,
          apellido,
          sucursal: sucursal_id as Types.ObjectId,
        };

        const cajeroCreado: any = await Cajero.create([cajeroToCreate], {
          session,
        });

        sucursalEncontrada.cajeros.push(cajeroCreado[0]._id as Types.ObjectId);

        await sucursalEncontrada.save();

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
          exito: true,
          mensaje: "¡Cajero creado satisfactoriamente!",
        });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return errorHandler(err, req, res, next);
      }
    }
  }
);

const getCajeroById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const estado = Estado.getInstance();

      if (estado.getArriba()) {
        next();
      } else {
        const { _id } = req.params;

        const cajero = await Cajero.findById(_id);

        if (!cajero)
          return notFound({
            message: "No se halló ningún cajero con el _id provisto.",
            next,
          });

        res.status(200).json(cajero);
      }
    }
  }
);
const getCajeroByCedula = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const estado = Estado.getInstance();

      if (estado.getArriba()) {
        next();
      } else {
        const { cedula } = req.params;

        const cajero = await Cajero.findOne({ cedula });

        if (!cajero)
          return notFound({
            message: "No se halló ningún cajero con la cédula provista.",
            next,
          });

        res.status(200).json(cajero);
      }
    }
  }
);

const getUsuarioCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const estado = Estado.getInstance();

      if (estado.getArriba()) {
        next();
      } else {
        const { _id } = req.params;

        const cajero = await Cajero.findOne({ _id });

        if (!cajero)
          return notFound({
            message: "No se halló ningún cajero con el id provisto.",
            next,
          });

        const usuario = await Usuario.findOne({ entidad_asociada: cajero._id });

        res.status(200).json(usuario);
      }
    }
  }
);

const getAllCajeros = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const cajeros = await Cajero.find({});

      res.status(200).json(cajeros);
    }
  }
);

const updateCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();

      try {
        session.startTransaction();
        const { _id } = req.params;

        const { cedula, nombre, apellido, sucursal_id } = req.body;

        const cashierFound: any = await Cajero.findById(_id).session(session);

        if (!cashierFound)
          return notFound({
            message: "No se halló ningún cajero con el _id provisto.",
            next,
          });

        const newFields = {
          cedula: cedula || cashierFound.cedula,
          nombre: nombre || cashierFound.nombre,
          apellido: apellido || cashierFound.apellido,
          sucursal: (sucursal_id as Types.ObjectId) || cashierFound.sucursal,
        };

        await Cajero.updateOne(cashierFound, newFields, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
          exito: true,
          mensaje: "Cajero actualizado satisfactoriamente.",
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return errorHandler(error, req, res, next);
      }
    }
  }
);

const deleteCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();

      try {
        session.startTransaction();
        const { _id } = req.params;

        const cajero: any = await Cajero.findById(_id).session(session);

        if (!cajero) {
          return notFound({
            message: "No se encontró ningún cajero con el _id provisto.",
            next,
          });
        }

        if (cajero.cuadres.length > 0) {
          return next(
            new ErrorResponse(
              "No puede eliminar a este cajero porque tiene cuadres/operaciones asociadas.",
              401
            )
          );
        }

        const sucursalAsociada: any = await Sucursal.findById(
          cajero.sucursal
        ).session(session);

        const idxToDelete = sucursalAsociada.cajeros.indexOf(cajero._id);

        sucursalAsociada.cajeros.splice(idxToDelete, 1);

        await sucursalAsociada.save();

        if (cajero.usuario)
          await Usuario.deleteOne({ _id: cajero.usuario }, { session });

        await Cajero.deleteOne({ _id: cajero._id }, { session });

        await session.commitTransaction();

        res.status(200).json({
          exito: true,
          mensaje: "!Cajero eliminado satisfactoriamente!",
        });
      } catch (error) {
        await session.abortTransaction();

        return errorHandler(error, req, res, next);
      } finally {
        session.endSession();
      }
    }
  }
);

const createUsuarioCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();
      session.startTransaction();

      try {
        const {
          cedula,
          email,
          contrasenia,
          tipo_entidad_asociada,
          perfil,
        } = req.body;

        const invalidFields: string = validateRegistration(req);

        if (invalidFields) return next(new ErrorResponse(invalidFields, 400));

        // Check if there's already a user with that email
        const userFound = await Usuario.findOne({ email }).session(session);

        if (userFound)
          return next(
            new ErrorResponse(
              "El correo electrónico provisto ya está tomado.",
              400
            )
          );

        if (tipo_entidad_asociada !== "Cajero")
          return next(
            new ErrorResponse(
              "Debe proveer 'Teller' como entidad asociada.",
              400
            )
          );

        const cajero: any = await Cajero.findOne({ cedula }).session(session);

        if (!cajero)
          return notFound({
            message: "No se encontró ningún cajero con la cédula provista.",
            next,
          });

        const usuarioRegistrado = await Usuario.findOne({
          entidad_asociada: cajero._id,
        }).session(session);

        if (usuarioRegistrado)
          return next(
            new ErrorResponse("Usted ya posee una cuenta de cajero.", 400)
          );

        const perfilFound = await Perfil.findOne({ rol: perfil }).session(
          session
        );

        if (!perfilFound)
          return notFound({ message: "El perfil provisto es inválido.", next });

        const newUser: any = await Usuario.create(
          [
            {
              email,
              contrasenia,
              tipo_entidad_asociada,
              entidad_asociada: cajero._id,
              perfil: perfilFound._id,
            },
          ],
          { session }
        );

        cajero.usuario = newUser[0]._id;
        await cajero.save();

        await session.commitTransaction();

        sendTokenResponse(newUser[0], 201, res, "sign up");
      } catch (error) {
        await session.abortTransaction();

        return errorHandler(error, req, res, next);
      } finally {
        session.endSession();
      }
    }
  }
);

const cajeroMiddleware = {
  createUsuarioCajero,
  deleteCajero,
  updateCajero,
  getAllCajeros,
  getUsuarioCajero,
  getCajeroByCedula,
  getCajeroById,
  createCajero,
};

export default cajeroMiddleware;
