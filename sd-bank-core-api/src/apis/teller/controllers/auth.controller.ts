import { errorHandler } from "./../../../shared/middlewares/error.middleware";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { sendTokenResponse } from "../../../shared/utils/auth.helpers";
import { validateCashierCredentials } from "../utils/cajero.helpers";
import Cajero from "../../../shared/models/Cajero";
import { ClientSession, startSession } from "mongoose";
import ErrorResponse from "../../../shared/utils/error-response";

// @desc     Cashier login
// @route    POST
// @access   public
export const signIn = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, contrasenia } = req.body;

    validateCashierCredentials(req, next);

    const cashier = await Cajero.findOne({ email }).select("+contrasenia");

    const isPasswordRight: boolean = await (cashier as any).matchPassword(
      contrasenia
    );
    if (!isPasswordRight) return validateCashierCredentials(req, next, true);

    sendTokenResponse(cashier, 200, res, "sign in");
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

    try {
      session.startTransaction();

      const {
        cedula,
        nombre,
        apellido,
        email,
        contrasenia,
        sucursal,
      } = req.body;

      const cashierFound = await Cajero.findOne({ cedula });
      if (cashierFound) {
        return next(
          new ErrorResponse("Ya existe un cajero con esas credenciales.", 400)
        );
      }

      const newCashier = await Cajero.create({
        cedula,
        nombre,
        apellido,
        email,
        contrasenia,
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
