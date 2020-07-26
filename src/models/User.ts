import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
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
    lastName: {
      type: String,
      required: [true, "The lastName field is required."],
    },
    email: {
      type: String,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email."],
      required: [true, "The email address is required."],
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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    accounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    loans: [
      {
         type: Schema.Types.ObjectId,
         ref: "Loan",
      }
    ]
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

// Encrypt password using bcryt
UserSchema.pre("save", async function (next: any) {
  const thisRef: any = this;

  if (!thisRef.isModified("password")) next();

  const salt: any = await bcrypt.genSalt(10);
  thisRef.password = await bcrypt.hash(thisRef.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, (process as any).env.JWT_SECRET);
};

// Match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = async function () {
  // Generate token
  const resetToken: string = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPassword field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", UserSchema);
