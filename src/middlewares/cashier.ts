import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import User from "../models/Usuario";
import { notFound } from "../utils/err-helpers";
import ErrorResponse from "../utils/error-response";
import Cashier from "../models/Cashier";

export const identifyUser = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {

   const { id } = req.body;

   const userFound = await User.findOne({id});

   if(!userFound){
      return notFound({entity: "User", next});
   }

   next();
});

export const protectCashierRoute = asyncHandler(async(req: Request, res: Response, next: NextFunction): Promise<void> => {

    let token: string = "";
    const header: string | undefined = req.headers.authorization;
      
    if (header && header.startsWith("Bearer")) {
        token = header.split(" ")[1];
    }

    if (!token){
       return next(new ErrorResponse("Unauthorized to access this route.", 401));
    }

    const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));
    (req as any).cashier = await Cashier.findById(decoded.id);
    next();    
});




