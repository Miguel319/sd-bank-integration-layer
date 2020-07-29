import { asyncHandler } from "../middlewares/async";
import { Request, Response, NextFunction } from "express";
import Cashier from "../models/Cashier";
import { validateCashierCredentials  } from "../utils/cashier-helpers";
import {sendTokenResponse} from "../utils/auth-helpers"
import ErrorResponse from "../utils/error-response";
import { CashierService } from "../services/cashier-service";

//@desc services
const cashierService = new CashierService();

// @desc     Cashier login.
// @route    POST 
// @access   public
export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const { id, password } = req.body;

    validateCashierCredentials(req, next);
    const cashier = await cashierService.getByIdWithSelect(id);
    const isPasswordRight: boolean = await (cashier as any).matchPassword(password);
    if (!isPasswordRight) return validateCashierCredentials(req, next, true);

    sendTokenResponse(cashier, 200, res, "sign in");
});

// @desc     a new cashier
// @route    POST 
// @access   private
export const createCashier = asyncHandler( async (req: Request,res: Response,next: NextFunction): Promise<void | Response> => {
      
    const { id, firstName, lastName, email, password, branch } = req.body;
    
    const cashierFound = await cashierService.getById(id);

    if (cashierFound){ 
        return next(new ErrorResponse("Cashier already created.", 400));
    };

    const newCashier: any = await cashierService.createCashier(req);
    sendTokenResponse(newCashier, 200, res, "sign up");
});

// @desc     Cashier is processing the payment of a user.
// @route    POST 
// @access   private
export const processLoanPayment = asyncHandler( async(req: Request,res: Response,next: NextFunction): Promise<void | Response> => {

   

});