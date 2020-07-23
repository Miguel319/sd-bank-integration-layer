import mongoose, { Schema, Types } from "mongoose";
import intFormat from "biguint-format";

import FlakeId from "flake-idgen";

const AccountSchema = new Schema(
  {
    account_type: {
      type: String,
      enum: ["Checkings", "Savings"],
      required: [true, "You must specify the account type (Checkings or Savings)."]
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
      minlength: [10, "The account number must have at least 10 characters."],
      maxlength: [12, "The account number can't exceed 12 characters."],
    },
    monthly_avg_balance: Number,
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    total_amount_in_transit: {
      type: Number,
      default: 0,
    },
    user: {
      type: Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

// Create a random but unique 12-digit account number
AccountSchema.pre("save", function (next: any) {
  const generator: FlakeId = new FlakeId();

  const uniqueAccNo: Buffer = generator.next();
  const uniqueAccNoFormat: string = String(intFormat(uniqueAccNo)).slice(0, 12);

  (this as any).account_number = uniqueAccNoFormat;
  next();
});

export default mongoose.model("Account", AccountSchema);
