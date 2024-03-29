import { Response, Request, NextFunction } from "express";
import ErrorResponse from "../utils/error-response";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let error: ErrorResponse = { ...err };

  error.message = err.message;

  console.log(error);

  // Mongoose bad ObjectId
  if (err.name === "CastError" || err.message.includes("404")) {
    const entityArr: string = err.message.split(" ");

    const entity = entityArr[entityArr.length - 1]
      .replace(/[""]/g, "")
      .toLowerCase();

    const message: string = `No se pudo encontrar ningún/ninguna ${entity} con el ID provisto.`;

    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const uniqueField: string = Object.keys(err.keyPattern).join("");

    error = new ErrorResponse(
      `El campo '${uniqueField}' es único. Ya existe un registro con el valor provisto.`,
      400
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message: any = Object.values(err.errors).map(
      (val: any) => val.message
    );

    error = new ErrorResponse(message, 400);
  }

  // Authorization validation
  if (err.name === "JsonWebTokenError")
    error = new ErrorResponse("No está autorizado a acceder a esta ruta.", 401);

  const errRes = err.isAxiosError
    ? err.response.data
    : {
        exito: false,
        error: error.message,
      };

  console.log(err);

  res
    .status(
      error.statusCode
        ? error.statusCode
        : err.response.status
        ? err.response.status
        : 500
    )
    .json(errRes);
};
