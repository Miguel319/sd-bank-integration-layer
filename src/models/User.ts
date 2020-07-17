import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email.",
      ],
      required: [true, "The email address is required."],
    },
    password: {
      type: String,
      required: [true, "The password field is required."],
      minlength: [6, "The password should be at least 6 characters long."],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    accounts: [
      {
        type: Types.ObjectId,
        ref: "Account",
      },
    ],
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("User", userSchema);
