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
    const message: string = `Unable to find resource with the ID ${
      (err as any).value || "provided."
    }`;

    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered.", 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message: any = Object.values(err.errors).map(
      (val: any) => val.message
    );

    error = new ErrorResponse(message, 400);
  }

  // Authorization validation
  if (err.name === "JsonWebTokenError") {
    error = new ErrorResponse("Unauthorized to access this route.", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};
