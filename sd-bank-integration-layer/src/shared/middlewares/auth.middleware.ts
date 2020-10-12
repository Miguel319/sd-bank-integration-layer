import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./async.middleware";
import ErrorResponse from "../utils/error-response";
import Usuario from "../models/Usuario";
import { Request } from "express";

// Protect routes
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";

    const header: string | undefined = req.headers.authorization;

    if (header && header.startsWith("Bearer")) {
      token = header.split(" ")[1];
    }

    // if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token)
      return next(
        new ErrorResponse("No está autorizado a acceder a esta ruta.", 401)
      );

    // Verify token
    const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));

    console.log(decoded);

    (req as any).user = await Usuario.findById(decoded.id);
    next();
  }
);
