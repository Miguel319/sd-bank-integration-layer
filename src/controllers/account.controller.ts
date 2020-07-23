import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";
import { asyncHandler } from "../middlewares/async";
import User from "../models/User";
import ErrorResponse from "../utils/error-response";

// @desc   Register user
// @route  POST /api/v1/account
// @access Public
export const createAccount = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { account_type, available_balance, account_number, user } = req.body;

    const userFound: any = await User.findById(user);

    if (!userFound)
      return next(new ErrorResponse("Unable to find user with that id.", 404));

    const accountToCreate = {
      account_type,
      available_balance,
      account_number,
      user,
    };

    const accountCreated: any = await Account.create(accountToCreate);

    userFound.accounts.push(accountCreated._id);

    await userFound.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  }
);
