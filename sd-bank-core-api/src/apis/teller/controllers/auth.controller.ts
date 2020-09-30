import { errorHandler } from "./../../../shared/middlewares/error.middleware";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { sendTokenResponse } from "../../../shared/utils/auth.helpers";
import { validateCashierCredentials } from "../utils/cajero.helpers";
import { ClientSession, startSession } from "mongoose";
import ErrorResponse from "../../../shared/utils/error-response";
import Usuario from "../../../shared/models/Usuario";
import Cajero from "../../../shared/models/Cajero";

// @desc     Cashier login
// @route    POST
// @access   public
export const signIn = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { email, contrasenia } = req.body;

      validateCashierCredentials(req, next);

      const cashier = await Usuario.findOne({ email }).select("+contrasenia");

      const isPasswordRight: boolean = await (cashier as any).matchPassword(
        contrasenia
      );
      if (!isPasswordRight) return validateCashierCredentials(req, next, true);

      await session.commitTransaction();
      session.endSession();

      sendTokenResponse(cashier, 200, res, "sign in");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

// @desc     a new cashier
// @route    POST
// @access   public
export const signUp = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { cedula, nombre, apellido, sucursal } = req.body;

      const cashierFound = await Cajero.findOne({ cedula });
      if (cashierFound) {
        return next(
          new ErrorResponse("Ya existe un cajero con esas credenciales.", 400)
        );
      }

      const newCashier = await Usuario.create({
        cedula,
        nombre,
        apellido,
        sucursal,
      });

      await session.commitTransaction();
      session.endSession();

      sendTokenResponse(newCashier, 201, res, "sign up");
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(err, req, res, next);
    }
  }
);
