import { errorHandler } from "./../../../shared/middlewares/error.middleware";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import {
  sendTokenResponse,
  validateUserCredentials,
} from "../../../shared/utils/auth.helpers";
import { validateCashierCredentials } from "../utils/cajero.helpers";
import { ClientSession, startSession } from "mongoose";
import Usuario from "../../../shared/models/Usuario";
import Cajero from "../../../shared/models/Cajero";
import ErrorResponse from "../../../shared/utils/error-response";
import { Estado } from "../../../shared/utils/estado";

// @desc     Cashier login
// @route    POST
// @access   public
const signIn = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();
      session.startTransaction();

      try {
        const { email, contrasenia } = req.body;

        validateCashierCredentials(req, next);

        const usuario: any = await Usuario.findOne({ email })
          .select("+contrasenia")
          .session(session);

        if (!usuario) return validateUserCredentials(req, next, true);

        const cajero = await Cajero.findById(usuario.entidad_asociada).session(
          session
        );

        if (!cajero)
          return next(
            new ErrorResponse("Sólo los cajeros pueden iniciar sesión.", 401)
          );

        const isPasswordRight: boolean = await usuario.matchPassword(
          contrasenia
        );

        if (!isPasswordRight)
          return validateCashierCredentials(req, next, true);

        await session.commitTransaction();

        sendTokenResponse(usuario, 200, res, "sign in", cajero);
      } catch (error) {
        await session.abortTransaction();

        return errorHandler(error, req, res, next);
      } finally {
        session.endSession();
      }
    }
  }
);

const authMiddleware = {
  signIn,
};

export default authMiddleware;
