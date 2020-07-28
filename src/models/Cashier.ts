import mongoose, { Schema } from "mongoose";

const CashierSchema = new Schema(
    {
      id: {
        type: String,
        required: [true, "The id field is mandatory"],
        minlength: [11, "The id must have eleven characters."],
        maxlength: [11, "The id must have eleven characters."],
      },
      name: {
        type: String,
        required: [true, "The name field is required."],
      },
      password: {
        type: String,
        required: [true, "The password field is required."],
        minlength: [6, "The password should be at least 6 characters long."],
        select: false,
        match: [
          /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$.%^&*])[\w!@#$.%^&*]{6,}$/,
          "The password must have upper and lowercase letter(s), number(s) & special character(s).",
        ],
      },
      initialDate: Date,
      endDate: Date,
      branch:{
          type: Schema.Types.ObjectId,
          ref: "Branch"
      }
    },
    {
      timestamps: true, // created_at, updated_at
    }
  );

  export default mongoose.model("Cashier", CashierSchema);