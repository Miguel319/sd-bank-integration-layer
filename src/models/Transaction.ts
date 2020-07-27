import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const TransactionSchema = new Schema(
  {
    account: {
      type: ObjectId,
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
    approved: {
      type: Boolean,
      default: true,
    },
    amount_in_transit: {
      type: Number,
      default: 0,
    },
    receiver: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Transaction", TransactionSchema);
