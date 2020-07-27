import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";
import { asyncHandler } from "../middlewares/async";
import User from "../models/User";
import ErrorResponse from "../utils/error-response";
import Transaction from "../models/Transaction";
import { notFound } from "../utils/err-helpers";
import {
  validateAccounts,
  validateSameBankTransfer,
  processInterbankTransfer,
} from "../utils/account-helpers";
import {
  getTransactionObjs,
  validateAccProvidedFields,
} from "../utils/account-helpers";
import {
  checkBalance,
  transferFunds,
  invalidInterbankTransfer,
} from "../utils/account-helpers";

// @desc   Create account
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

    if (!userFound) return notFound({ entity: "User", next });

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

    if (!userFound) return notFound({ message: "Message", next });

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
      return next(new ErrorResponse("You must deposit at least RD$2.00.", 400));

    const accountFound: any = await Account.findById(_id);

    // checkIfFound({ next, entity: "Account" }, accountFound);

    // Add the provided balance to the existing one
    accountFound.available_balance += Number(amount);
    accountFound.current_balance += Number(amount);

    await accountFound.save();

    res.status(200).json({
      success: true,
      message: `RD$${amount}.00 were successfully deposited into your account!`,
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

    const account = await Account.findById(_id);

    if (!account) return notFound({ next, entity: "Account" });

    res.status(200).json(account);
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

// @desc   Get user details by a given account number
// @route  GET /api/v1/accounts/:_account_no/user-details
// @access Private
export const getUserDetailsByAccountNo = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { account_no } = req.params;

    const account: any = await Account.findOne({ account_number: account_no });

    if (!account) return notFound({ next, entity: "Account" });

    const user = await User.findById(account.user);

    if (!user) return notFound({ next, entity: "User" });

    res.status(200).json(user);
  }
);

// @desc   Transfer funds to one of the user's accounts
// @route  PUT /api/v1/accounts/:_id/personal-transfer
// @access Private
export const transferToMyself = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* accountId */ } = req.params;
    const { user_id, receiver_account_no, amount } = req.body;

    const areFieldsInvalid: string | undefined = validateAccProvidedFields(req);

    if (areFieldsInvalid)
      return next(new ErrorResponse(areFieldsInvalid!, 400));

    const sender: any = await User.findById(user_id);

    if (!sender) return notFound({ entity: "Sender", next });

    // Find account by the provided account number
    const receiverAcc = await Account.findOne({
      account_number: receiver_account_no,
    });

    if (!receiverAcc) return notFound({ entity: "Receiver account", next });

    const senderAcc = await Account.findById(_id);

    const areAccountsInvalid: string | undefined = validateAccounts(
      user_id,
      senderAcc,
      receiverAcc
    );

    if (areAccountsInvalid)
      return next(new ErrorResponse(areAccountsInvalid!, 400));

    const amountToTransfer: number = Number(amount);

    // Make sure the user has enough funds to perform the transfer
    const notEnoughFunds: string | undefined = checkBalance(
      amountToTransfer,
      senderAcc
    );

    if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

    transferFunds(senderAcc, receiverAcc, amountToTransfer);

    // getTransactionObjs() returns the objects from which the transactions will be created
    const [transactionFrom, transactionTo]: Array<Object> = getTransactionObjs(
      req,
      senderAcc,
      receiverAcc
    );

    await Transaction.create(transactionFrom);
    await Transaction.create(transactionTo);

    await senderAcc?.save();
    await receiverAcc?.save();

    res.status(200).json({
      success: true,
      message: `RD$${amountToTransfer} were successfully transferred!`,
      approvalNumber: undefined, // TODO: Generate approval number,
      transferAmount: amount,
      fee: "RD$10.00",
    });
  }
);

// @desc   Transfer funds to a third party within the same bank
// @route  PUT /api/v1/accounts/:_id/third-party-transfer
// @access Private
export const sameBankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* account_id */ } = req.params;
    const { user_id, receiver_account_no, amount } = req.body;

    const areFieldsInvalid: string | undefined = validateAccProvidedFields(req);

    if (areFieldsInvalid)
      return next(new ErrorResponse(areFieldsInvalid!, 400));

    const sender: any = await User.findById(user_id);

    if (!sender) return notFound({ entity: "Sender", next });

    const senderAcc = await Account.findById(_id);

    if (!senderAcc)
      return notFound({ message: "Sender account not found.", next });

    const receiverAcc = await Account.findOne({
      account_number: receiver_account_no,
    });

    if (!receiverAcc)
      return notFound({
        message: "The provided receiver account doesn't belong this bank.",
        next,
      });

    const isTransferPersonal = validateSameBankTransfer(sender, receiverAcc);

    if (isTransferPersonal)
      return next(new ErrorResponse(isTransferPersonal!, 400));

    // Locate receiver by its associated user_id
    const receiver = await User.findById((receiverAcc as any).user);

    if (!receiver) return notFound({ message: "Unable find receiver.", next });

    const amountToTransfer: number = Number(amount);

    const notEnoughFunds: string | undefined = checkBalance(
      amountToTransfer,
      senderAcc
    );

    if (notEnoughFunds) return next(new ErrorResponse(notEnoughFunds!, 400));

    transferFunds(senderAcc, receiverAcc, amountToTransfer);

    // getTransactionObjs() returns the objects from which the transactions will be created
    const [transactionFrom, transactionTo]: Array<Object> = getTransactionObjs(
      req,
      senderAcc,
      receiverAcc
    );

    await Transaction.create(transactionFrom);
    await Transaction.create(transactionTo);

    await senderAcc.save();
    await receiverAcc.save();

    res.status(200).json({
      success: true,
      message: `RD$${amountToTransfer}.00 were successfully transferred!`,
      approvalNumber: undefined, // TODO: Generate approval number,
      transferAmount: `RD$${amountToTransfer}.00`,
      fee: "RD$10.00",
    });
  }
);

