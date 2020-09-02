import { asyncHandler } from "../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import Cajero from "../models/Cajero";
import { validateCashierCredentials } from "../utils/cajero.helpers";
import { sendTokenResponse } from "../utils/auth.helpers";
import ErrorResponse from "../utils/error-response";
import { startSession } from "mongoose";

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
    const session = await startSession();

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

      sendTokenResponse(newCashier, 201, res, "sign up");
    } catch (err) {
      await session.abortTransaction();

      res.status(400).json({
        exito: false,
        mensaje: "No se pudo crear el cajero.",
        err,
      });
    }
  }
);

// @desc     Cashier is processing the payment of a user.
// @route    POST
// @access   private
export const processLoanPayment = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {}
);
