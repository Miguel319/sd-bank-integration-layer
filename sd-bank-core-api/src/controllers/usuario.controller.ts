import { Response, Request, NextFunction } from "express";

import Usuario from "../models/Usuario";
import { asyncHandler } from "../middlewares/async.middleware";
import ErrorResponse from "../utils/error-response";
import { notFound } from "../utils/err.helpers";
import {
  sendTokenResponse,
  validateUserCredentials,
} from "../utils/auth.helpers";

// @desc   Register user
// @route  POST /api/v1/auth/signup
// @access   Public
export const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula, nombre, apellido, email, contrasenia } = req.body;

    // Check if there's already a user with that email
    const userFound = await Usuario.findOne({ email });

    if (userFound)
      return next(
        new ErrorResponse("El correo electrónico provisto ya está tomado.", 400)
      );

    const newUser: any = await Usuario.create({
      cedula,
      nombre,
      apellido,
      email,
      contrasenia,
    });

    sendTokenResponse(newUser, 201, res, "sign up");
  }
);

// @desc     Sign in
// @route    POST api/v1/auth/signin
// @access   Public
export const signin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, contrasenia } = req.body;

    validateUserCredentials(req, next);

    // Check for user by its email
    const user = await Usuario.findOne({ email }).select(
      "+contrasenia"
    );

    if (!user) return validateUserCredentials(req, next, true);

    const isPasswordRight: boolean = await (user as any).matchPassword(
      contrasenia
    );

    if (!isPasswordRight) return validateUserCredentials(req, next, true);

    sendTokenResponse(user, 200, res, "sign in");
  }
);

// @desc     Get current logged in user
// @route    GET api/v1/auth/current-user
// @access   Private
export const currentUser = asyncHandler(
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
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
);

// @desc     Forgot password
// @route    POST api/v1/auth/forgot-password
// @access   Public
export const forgotPassword = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    // TODO: SendGrip setup

    const { email } = req.body;
    const user = await Usuario.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse(
          "No existe ningún usuario con ese correo electrónico.",
          404
        )
      );
    }

    const resetToken = (user as any).getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    console.log(resetToken);

    res.status(200).json(user);
  }
);

// @desc     Delete user
// @route    POST api/v1/auth/
// @access   Private --> Only admins
export const deleteUsuario = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const user = await Usuario.findById(_id);

    if (!user) return notFound({ entity: "Usuario", next });

    await Usuario.deleteOne(user);

    res.status(200).json({
      exito: true,
      mensaje: "¡Usuario eliminado satisfactoriamente!",
    });
  }
);
