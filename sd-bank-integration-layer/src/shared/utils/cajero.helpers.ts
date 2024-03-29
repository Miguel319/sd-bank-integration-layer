import ErrorResponse from "./error-response";
import { NextFunction, Request, Response } from "express";

export const validateCashierCredentials = (
  req: Request,
  next: NextFunction,
  unuthorized: boolean = false
) => {
  const { email, contrasenia } = req.body;

  if (!email || !contrasenia)
    return next(
      new ErrorResponse(
        "El correo electrónico y la contraseña son mandatorios.",
        400
      )
    );

  if (unuthorized)
    return next(
      new ErrorResponse(
        "Credenciales inválidas. Revíselas e intente de nuevo.",
        401
      )
    );
};
