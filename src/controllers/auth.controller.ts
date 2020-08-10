import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/async";
import User from "../models/User";
import ErrorResponse from "../utils/error-response";
import {
  validateUserCredentials,
  sendTokenResponse,
} from "../utils/auth-helpers";

// @desc   Register user
// @route  POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula, nombre, apellido, email, contrasenia } = req.body;

    // Check if there's already a user with that email
    const userFound = await User.findOne({ email });

    if (userFound)
      return next(
        new ErrorResponse("Ese correo electrónico ya está tomado.", 400)
      );

    const newUser: any = await User.create({
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
    const user = await User.findOne({ email }).select("+contrasenia");

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
    const { id } = (req as any).user;

    const user = await User.findById(id);

    res.status(200).json({
      exito: true,
      data: user,
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
    const user = await User.findOne({ email });

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

    res.status(200).json({
      exito: true,
      data: user,
    });
  }
);
