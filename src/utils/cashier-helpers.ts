import ErrorResponse from "./error-response";
import { NextFunction, Request, Response } from "express";

export const validateCashierCredentials = (req: Request,next: NextFunction,unuthorized: boolean = false) => {
    const { id, password } = req.body;
  
    if (!id || !password)
      return next(
        new ErrorResponse("The email and password fields are mandatory.", 400)
      );
  
    if (unuthorized){
      return next(new ErrorResponse("Invalid credentials. Please check them and try again.",401));
    }
     
  };