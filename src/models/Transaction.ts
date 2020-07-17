import mongoose, { Schema, Types } from "mongoose";

const TransactionSchema = new Schema(
  {
    account: {
      type: Types.ObjectId,
      ref: "Account",
    },
    description: String,
    amount: {
      type: Number,
      required: [true, "You must provide the transaction's amount."],
    },
    type: {
      type: String,
      required: [true, "You must provide the transaction's type."],
      enum: ["Transfer", "Withdrawal", "Purchase", "Deposit"],
    },
    voucher: {
      type: Boolean,
      default: true,
    },
    amount_in_transit: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Transaction", TransactionSchema);
