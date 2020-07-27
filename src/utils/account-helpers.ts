import { Request, NextFunction } from "express";
import ErrorResponse from "./error-response";

export const validateAccounts = (
  userId: any,
  senderAcc: any,
  receiverAcc: any
) => {
  let isReceiverValid: boolean = String(receiverAcc.user) === String(userId);

  if (!isReceiverValid)
    return "When it comes to personal transfers, both accounts must belong to the same user.";

  let areAccountsEqual: boolean =
    senderAcc.account_number === receiverAcc.account_number;

  if (areAccountsEqual) return "The accounts must be different.";
};

export const checkBalance = (
  amount: number,
  senderAcc: any
): string | undefined => {
  const currentBalance = senderAcc.current_balance;

  const fee: number = 10;

  const notEnoughFunds: boolean =
    senderAcc.available_balance - fee < amount && currentBalance - fee < amount;

  if (notEnoughFunds)
    return `You don't have enough funds to process this transfer. Current balance = RD$${currentBalance}. Transfer Amount = RD$${amount} + RD$${fee}.00 fee`;
};

export const validateSameBankTransfer = (
  sender: any,
  receiverAcc: any
): undefined | string => {
  const accBelongsToTheSameUser = sender.accounts.find(
    (v: any) => String(v) === String(receiverAcc._id)
  );

  if (!accBelongsToTheSameUser) return;

  return "The receiver account must belong to someone else within SD-Bank.";
};

export const invalidInterbankTransfer = (next: any): any => {
  return next(
    new ErrorResponse(
      "The receiver account must be from a different bank.",
      400
    )
  );
};

export const transferFunds = (
  senderAcc: any,
  receiverAcc: any,
  amountToTransfer: number
): void => {
  // The transaction has a RD$10.00 fee
  const tenPesosFee: number = 10;

  // Funds deducted from
  senderAcc.current_balance -= amountToTransfer + tenPesosFee;
  senderAcc.available_balance -= amountToTransfer + tenPesosFee;

  // Funds transferred to
  receiverAcc.current_balance += amountToTransfer;
  receiverAcc.available_balance += amountToTransfer;
};

export const processInterbankTransfer = (
  senderAcc: any,
  amountToTransfer: number
) => {
  // The transaction has a RD$10.00 fee
  const tenPesosFee: number = 10;

  // Funds deducted from
  senderAcc.current_balance -= amountToTransfer + tenPesosFee;
  senderAcc.available_balance -= amountToTransfer + tenPesosFee;
};

export const getInterbankTransactionObj = (req: Request, senderAcc: any) => {
  const { _id /* account_id */ } = req.params;
  const { receiver_account_number, amount, description, } = req.body;

  const transactionFrom = {
    account: _id,
    description:
      description ||
      `RD${amount} Interbank bank transfer ${receiver_account_number}`,
    amount,
    type: "Transfer",
  };
}

export const getTransactionObjs = (
  req: Request,
  senderAcc: any,
  receiverAcc: any
): Array<Object> => {
  const { _id /* account_id */ } = req.params;
  const { receiver_account_number, amount, description } = req.body;

  const transactionFrom = {
    account: _id,
    description:
      description ||
      `RD${amount} transferred to your other account ${receiver_account_number}`,
    amount,
    type: "Transfer",
  };

  const transactionTo = {
    account: receiverAcc._id,
    description:
      description ||
      `RD$${amount} transferred from your other account: ${senderAcc.account_number}`,
    amount,
    type: "Transfer",
  };

  return [transactionFrom, transactionTo];
};

export const validateAccProvidedFields = (req: Request): string | undefined => {
  const { user_id, receiver_account_no, amount } = req.body;

  if (Number(amount) < 2) return "You must transfer at least RD$2.00.";

  const body: any = { user_id, receiver_account_no, amount };

  const errList = [];

  for (let elem in body) {
    if (!body[elem]) errList.push(`'${elem}' is mandatory. `);
  }

  if (errList.length === 0) return;

  return errList.join("");
};
