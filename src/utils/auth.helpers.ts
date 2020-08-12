import ErrorResponse from "./error-response";
import { NextFunction, Request, Response } from "express";

export const validateUserCredentials = (
  req: Request,
  next: NextFunction,
  unuthorized: boolean = false
) => {
  const { email, contrasenia } = req.body;

  if (!email || !contrasenia)
    return next(
      new ErrorResponse("El correo electrónico y la contraseña son obligatorios.", 400)
    );

  if (unuthorized)
    return next(
      new ErrorResponse(
        "Credenciales inválidas. Compruebe que sean correctas e intente de nuevo.",
        401
      )
    );
};

// Get token from model, create cookie and send response
export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  operacion: string
) => {
  // Create token
  const token: string = user.getSignedJwtToken();

  const options: any = { httpOnly: true };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token)
    .json({
      exito: true,
      mensaje: `${
        operacion === "sign up" ? "¡Cuenta creada" : "¡Sesión iniciada"
      } exitosamente!`,
      token,
    });
};
