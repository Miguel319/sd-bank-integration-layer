import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./async.middleware";
import Cliente from "../models/Cliente";
import { notFound } from "../utils/err.helpers";
import ErrorResponse from "../utils/error-response";
import Cashier from "../models/Cajero";

export const identifyClient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cedula } = req.body;

    if (!cedula)
      return next(
        new ErrorResponse("Debe proveer el número de cédula del cliente.", 400)
      );

    const clientFound = await Cliente.findOne({ cedula });

    if (!clientFound)
      return notFound({
        message: "No se halló ningún cliente con la cédula provista.",
        next,
      });

    next();
  }
);

export const protectCashierRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string = "";
    const header: string | undefined = req.headers.authorization;

    if (header && header.startsWith("Bearer")) {
      token = header.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorResponse("Unauthorized to access this route.", 401));
    }

    const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));
    (req as any).cashier = await Cashier.findById(decoded.id);
    next();
  }
);
