import { asyncHandler } from "../middlewares/async";
import { Request, Response, NextFunction } from "express";
import Cashier from "../models/Cashier";
import { validateCashierCredentials  } from "../utils/cashier-helpers";
import {sendTokenResponse} from "../utils/auth-helpers"


export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const { id, password } = req.body;

    validateCashierCredentials(req, next);
    const cashier = await Cashier.findOne({ id }).select("+password");
    const isPasswordRight: boolean = await (cashier as any).matchPassword(password);
    if (!isPasswordRight) return validateCashierCredentials(req, next, true);

    sendTokenResponse(cashier, 200, res, "sign in");

});