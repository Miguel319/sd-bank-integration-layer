import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../../../shared/utils/error-response";

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

export const getPrestamoOp = (
  cajeroAsociado: any,
  montoADepositar: number,
  cuadreAsociado: any,
  cliente: any
) => {
  return {
    cajero: cajeroAsociado._id,
    descripcion: `El cajero ${cajeroAsociado.nombre} ${
      cajeroAsociado.apellido
    } procesó un pago de préstamo de RD$${montoADepositar.toLocaleString()} del cliente ${
      cliente.nombre
    } ${cliente.apellido}.`,
    tipo: "Pago de prestamo",
    monto: montoADepositar,
    cuadre: cuadreAsociado._id,
  };
};
