import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name field is required."],
    },
    lastName: {
      type: String,
      required: [true, "The lastName field is required."],
    },
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
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]$/,
        "The password must have upper and lowercase letter(s), number(s) & special character(s).",
      ],
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
