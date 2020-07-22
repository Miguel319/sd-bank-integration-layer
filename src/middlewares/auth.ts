import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import ErrorResponse from "../utils/error-response";
import User from "../models/User";
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
      return next(new ErrorResponse("Unauthorized to access this route.", 401));

    // Verify token
    const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));

    console.log(decoded);

    (req as any).user = await User.findById(decoded.id);
    next();
  }
);
