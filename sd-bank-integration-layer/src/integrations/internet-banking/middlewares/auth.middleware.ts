import { Types, startSession, ClientSession } from "mongoose";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import Usuario from "../../../shared/models/Usuario";
import Cliente from "../../../shared/models/Cliente";
import {
  sendTokenResponse,
  validateUserCredentials,
} from "../../../shared/utils/auth.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { notFound } from "../../../shared/utils/err.helpers";
import Perfil from "../../../shared/models/Perfil";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { Estado } from "../../../shared/utils/estado";

// @desc   Register user
// @route  POST /api/v1/auth/signup
// @access   Public
const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const estado = Estado.getInstance();

    if (estado.getIbArriba()) {
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

        // Check if there's already a user with that email
        const userFound = await Usuario.findOne({ email });

        if (userFound)
          return next(
            new ErrorResponse(
              "El correo electrónico provisto ya está tomado.",
              400
            )
          );

        if (tipo_entidad_asociada !== "Cliente")
          return next(
            new ErrorResponse(
              "El tipo de entidad asociada debe ser 'Cliente'.",
              400
            )
          );

        const cliente: any = await Cliente.findOne({ cedula });

        if (!cliente)
          return notFound({
            message: "No se encontró ningún cliente con la cédula provista.",
            next,
          });

        const usuarioRegistrado = await Usuario.findOne({
          entidad_asociada: cliente._id,
        });

        if (usuarioRegistrado) {
          return next(
            new ErrorResponse(
              "Usted ya posee una cuenta de Internet Banking.",
              400
            )
          );
        }

        const perfilFound = await Perfil.findOne({ rol: perfil });

        if (!perfilFound)
          return notFound({ message: "El perfil provisto es inválido.", next });

        const newUser: any = await Usuario.create({
          email,
          contrasenia,
          tipo_entidad_asociada,
          entidad_asociada: cliente._id,
          perfil: perfilFound._id as Types.ObjectId,
        });

        cliente.usuario = newUser._id;
        await cliente.save();

        await session.commitTransaction();
        session.endSession();

        sendTokenResponse(newUser, 201, res, "sign up", cliente);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorHandler(error, req, res, next);
      }
    }
  }
);

const fetchPerfiles = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const estado = Estado.getInstance();

    if (estado.getIbArriba()) {
      next();
    } else {
      const perfiles = await Perfil.find({});

      res.status(200).json(perfiles);
    }
  }
);

// @desc     Sign in
// @route    POST api/v1/auth/signin
// @access   Public
const signin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const estado = Estado.getInstance();

    if (estado.getIbArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();
      session.startTransaction();

      try {
        const { email, contrasenia } = req.body;

        validateUserCredentials(req, next);

        // Check for user by its email
        const user: any = await Usuario.findOne({ email }).select(
          "+contrasenia"
        );

        if (!user) return validateUserCredentials(req, next, true);

        const cliente = await Cliente.findById(user.entidad_asociada);

        if (!cliente)
          return next(
            new ErrorResponse(
              "No se encontró ningún cliente asociado a este usuario.",
              400
            )
          );

        const isPasswordRight: boolean = await (user as any).matchPassword(
          contrasenia
        );

        if (!isPasswordRight) return validateUserCredentials(req, next, true);

        await session.commitTransaction();
        session.endSession();

        sendTokenResponse(user, 200, res, "sign in", cliente);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return errorHandler(error, req, res, next);
      }
    }
  }
);

// @desc     Get current logged in user
// @route    GET api/v1/auth/current-user
// @access   Private
const currentUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const estado = Estado.getInstance();

    if (estado.getIbArriba()) {
      next();
    } else {
      const { _id } = (req as any).user;

      const user = await Usuario.findById(_id);

      res.status(200).json(user);
    }
  }
);


const authMiddleware = {
  signin,
  signup,
  currentUser,
  fetchPerfiles,
};

export default authMiddleware;
