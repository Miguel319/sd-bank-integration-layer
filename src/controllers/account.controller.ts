import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";
import { asyncHandler } from "../middlewares/async";
import User from "../models/User";
import ErrorResponse from "../utils/error-response";
import Transaction from "../models/Transaction";

// @desc   Register user
// @route  POST /api/v1/accounts
// @access Private
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

// @desc   Get all accounts
// @route  GET /api/v1/accounts
// @access Private
export const getAllAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const accounts = await Account.find({});

    res.status(200).json(accounts);
  }
);

// @desc   Display the accounts from a given user by searching for his/her id
// @route  GET /api/v1/accounts/user/:_id
// @access Private
export const getUserAccounts = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const userFound: any = await User.findById(_id);

    if (!userFound)
      next(new ErrorResponse("Unable to find user with that id", 404));

    const accounts = await Account.find({ _id: userFound._id });

    res.status(200).json(accounts);
  }
);

// @desc   Deposit funds into a given account
// @route  PUT /api/v1/accounts/:_id/deposit
// @access Private
export const depositFunds = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    const { amount } = req.body;

    if (amount < 2)
      next(new ErrorResponse("You must deposit at least RD$2.00", 400));

    const accountFound: any = await Account.findById(_id);

    if (!accountFound)
      next(new ErrorResponse("Unable to find account with that id", 404));

    // Add the provided balance to the existing one
    accountFound.available_balance =
      accountFound.available_balance + Number(amount);
    accountFound.current_balance =
      accountFound.current_balance + Number(amount);

    await accountFound.save();

    res.status(200).json({
      success: true,
      message: `RD$${amount} were successfully deposited into your account!`,
    });
  }
);

// @desc   GET account information with its _id
// @route  GET /api/v1/accounts/:_id
// @access Private
export const getAccountDetailsById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const account = await Account.find({ _id });

    if (!account) next(new ErrorResponse("Account not found.", 404));
    
    res.status(200).json(account[0]);
  }
);

// @desc   Display transaction history of a given account
// @route  GET /api/v1/accounts/:_id/transactions
// @access Private
export const transactionHistory = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { account } = req.params;

    const transactions = await Transaction.find({ account });

    res.status(200).json(transactions);
  }
);
