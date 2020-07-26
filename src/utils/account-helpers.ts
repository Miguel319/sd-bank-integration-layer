import { NextFunction, Request } from "express";

export const validateAccounts = (accountFrom: any, accountTo: any): string => {
  if (accountFrom === accountTo) return "The accounts must be different.";

  const message: string =
    !accountFrom && !accountTo
      ? `None of those account numbers belong to this user.`
      : !accountFrom
      ? `The ${accountFrom} account number doesn't belong to this user.`
      : !accountTo
      ? `The ${accountTo} account number doesn't belong to this user.`
      : "";

  return message;
};

type FromTo = {
  accountFrom: any;
  accountTo: any;
};

export const getAccFromNTo = (_id: any, to: any, sender: any): FromTo => {
  let accountFrom: any = _id;
  let accountTo: any = to;

  for (let elem of sender.accounts) {
    if (String(elem) == String(_id)) accountFrom = elem;
    if (String(elem) == String(to)) accountTo = elem;
  }

  return { accountFrom, accountTo };
};

export const validateTransfer = (
  next: NextFunction,
  account: any,
  amount: number
): string | undefined => {
  const currentBalance = account.current_balance;

  // The -10 is because there's a RD$10.00 fee
  const fee: number = 10;

  const notEnoughFunds: boolean =
    account.available_balance - fee < amount && currentBalance - fee < amount;

  if (notEnoughFunds)
    return `You don't have enough funds to process this transfer. Current balance = RD$${currentBalance}. Transfer Amount = RD$${amount} + RD$${fee}.00 fee`;
};

export const transferFunds = (
  accountFromFound: any,
  accountToFound: any,
  amountToTransfer: any
): void => {
  // The transaction has a RD$10.00 fee
  const tenPesosFee: number = 10;

  // Funds deducted from
  accountFromFound.current_balance -= amountToTransfer + tenPesosFee;
  accountFromFound.available_balance -= amountToTransfer + tenPesosFee;

  // Funds transferred to
  accountToFound.current_balance += amountToTransfer;
  accountToFound.available_balance += amountToTransfer;
};

export const getTransactionObjs = (
  from: any,
  to: any,
  amount: number,
  description: string
): Array<Object> => {
  const transactionFrom = {
    account: from,
    description:
      description || `RD${amount} transferred to your other account: ${to}`,
    amount,
    type: "Transfer",
  };

  const transactionTo = {
    account: to,
    description:
      description ||
      `RD$${amount} transferred from your other account: ${from}`,
    amount,
    type: "Transfer",
  };

  return [transactionFrom, transactionTo];
};

export const validateAccProvidedFields = (req: Request): string | undefined => {
  const { userId, to, amount } = req.body;

  if (Number(amount) < 2) return "You must transfer at least RD$2.00.";

  const body: any = { userId, to, amount };

  const errList = [];

  for (let elem in body) {
    if (!body[elem])
      errList.push(
        `${elem.slice(0, 1).toUpperCase()}${elem.slice(1)} is mandatory. `
      );
  }

  if (errList.length === 0) return;

  return errList.join("");
};
