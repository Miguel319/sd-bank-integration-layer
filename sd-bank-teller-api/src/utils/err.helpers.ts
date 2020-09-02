import { NextFunction } from "express";
import ErrorResponse from "./error-response";

export type NotFound404 = {
  next: NextFunction;
  entity?: string;
  message?: string;
};

export const notFound = (notFoundObj: NotFound404) => {
  const { next, entity, message } = notFoundObj;

  const customMessage: string =
    entity === "Sucursal" ? "no encontrada." : "no encontrado.";

  return next(new ErrorResponse(message || `${entity} ${customMessage}`, 404));
};
