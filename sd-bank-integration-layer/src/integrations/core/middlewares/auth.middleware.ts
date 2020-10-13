import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Perfil from "../../../shared/models/Perfil";
import Usuario from "../../../shared/models/Usuario";
import {
  sendTokenResponse,
  validateUserCredentials,
} from "../../../shared/utils/auth.helpers";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { validateRegistration } from "../../../shared/utils/auth.helpers";
import Admin from "../../../shared/models/Admin";
import { Types, ClientSession, startSession } from "mongoose";
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

        if (tipo_entidad_asociada !== "Admin")
          return next(
            new ErrorResponse(
              "Debe proveer 'Admin' como entidad asociada.",
              400
            )
          );

        const admin: any = await Admin.findOne({ cedula }).session(session);

        if (!admin)
          return notFound({
            message:
              "No se encontró ningún administrador con la cédula provista.",
            next,
          });

        const usuarioRegistrado = await Usuario.findOne({
          entidad_asociada: admin._id,
        }).session(session);

        if (usuarioRegistrado) {
          return next(
            new ErrorResponse(
              "Usted ya posee una cuenta de administrador.",
              400
            )
          );
        }

        const perfilFound = await Perfil.findOne({ rol: perfil }).session(
          session
        );

        if (!perfilFound)
          return notFound({ message: "El perfil provisto es inválido.", next });

        const userToCreate = {
          email,
          contrasenia,
          tipo_entidad_asociada,
          entidad_asociada: admin._id as Types.ObjectId,
          perfil: perfilFound._id as Types.ObjectId,
        };

        const newUser: any = await Usuario.create([userToCreate], { session });

        admin.usuario = newUser[0]._id;
        await admin.save();

        await session.commitTransaction();

        sendTokenResponse(newUser[0], 201, res, "sign up", admin);
      } catch (error) {
        await session.abortTransaction();

        return errorHandler(error, req, res, next);
      } finally {
        session.endSession();
      }
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

    if (estado.getArriba()) {
      next();
    } else {
      const { email, contrasenia } = req.body;

      validateUserCredentials(req, next);

      // Check for user by its email
      const user: any = await Usuario.findOne({ email }).select("+contrasenia");

      if (!user) return validateUserCredentials(req, next, true);

      const admin = await Admin.findById(user.entidad_asociada);

      if (!admin)
        return next(
          new ErrorResponse(
            "Sólo los administradores pueden iniciar sesión.",
            401
          )
        );

      const isPasswordRight: boolean = await user.matchPassword(contrasenia);

      if (!isPasswordRight) return validateUserCredentials(req, next, true);

      sendTokenResponse(user, 200, res, "sign in", admin);
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
    const { _id } = (req as any).user;

    const user = await Usuario.findById(_id);

    res.status(200).json(user);
  }
);

// @desc     Change password
// @route    POST api/v1/auth/forgot-password
// @access   Public
const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getArriba()) {
      next();
    } else {
      const { email } = req.params;
      const { contrasenia } = req.body;

      const user: any = await Usuario.findOne({ email });

      if (!user) return notFound({ entity: "Usuario", next });

      const validPassword: boolean = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$.%^&*])[\w!@#$.%^&*]{6,}$/.test(
        contrasenia
      );

      if (!validPassword)
        return next(
          new ErrorResponse(
            "La contraseña debe estar compuesta por letras mayúsculas y minúsculas, así como por números y caracteres especiales.",
            400
          )
        );

      user.password = contrasenia;

      await user.save();

      res.status(200).json({
        exito: true,
        mensaje: "¡Su contraseña ha sido actualizada satisfactoriamente!",
      });
    }
  }
);

const authMiddleware = {
  signin,
  signup,
  currentUser,
};

export default authMiddleware;
