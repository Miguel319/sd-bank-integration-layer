import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";
import { asyncHandler } from "../middlewares/async";

// const createAccount = asyncHandler(
//   async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void | Response> => {

//     await Acc
//   }
// );
