import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      account_type,
      available_balance,
      current_balance,
      account_number,
    } = req.body;

    const account = {
      account_type,
      available_balance,
      current_balance,
      account_number,
    };

    await Account.create(account);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      error,
    });
  }
};

/*
 account_type: {
    type: String,
    enum: ["Checkings", "Savings"],
    default: "Savings",
  },
  available_balance: {
    type: Number,
    default: 0,
  },
  current_balance: {
    type: Number,
    default: 0,
  },
  account_number: {
    type: String,
    required: [true, "The account number field is required."],
    minlength: [10, "The account number must have at least 10 characters."],
    maxlength: [12, "The account number can't exceed 12 characters."],
  },
  monthly_avg_balance: Number,
  transactions: [
    {
      type: Types.ObjectId,
      ref: "Transaction",
    },
  ],
  total_amount_in_transit: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true, // created_at, updated_at
}*/
