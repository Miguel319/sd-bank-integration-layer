import { NextFunction } from "express";
import ErrorResponse from "./error-response";

export type NotFound404 = {
  next: NextFunction;
  entity?: string;
  message?: string;
};
// (notFound: NotFound) => void

export const notFound = (notFoundObj: NotFound404) => {
  const { next, entity, message } = notFoundObj;

  return next(new ErrorResponse(message || `${entity} no encontrado.`, 404));
};
