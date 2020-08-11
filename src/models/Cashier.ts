import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { ObjectId } = Schema.Types;

const CajeroSchema = new Schema(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria."],
      unique: [true, "Ya existe un cajero con esta cédula."],
      minlength: [11, "La cédula debe tener 11 caracteres."],
      maxlength: [11, "La cédula debe tener 11 caracteres."],
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio."],
    },
    contrasenia: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
      select: false,
      match: [
        /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$.%^&*])[\w!@#$.%^&*]{6,}$/,
        "La contraseña debe estar compuesta por letras mayúsculas y minúsculas, números y caracteres especiales.",
      ],
    },
    sucursal: {
      type: ObjectId,
      ref: "Sucursal",
    },
    resetcontraseniaToken: String,
    resetcontraseniaExpire: Date,
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

// Encrypt password using bcryt
CajeroSchema.pre("save", async function (next: any) {
  const thisRef: any = this;

  if (!thisRef.isModified("contrasenia")) next();

  const salt: any = await bcrypt.genSalt(10);
  thisRef.contrasenia = await bcrypt.hash(thisRef.contrasenia, salt);
});

CajeroSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, (process as any).env.JWT_SECRET);
};

//Match cashier entered password to hashed password in db
CajeroSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.contrasenia);
};

// Generate and hash password token
CajeroSchema.methods.getResetPasswordToken = async function () {
  // Generate token
  const resetToken: string = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetcontrasenia field
  this.resetcontraseniaToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetcontraseniaExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("Cajero", CajeroSchema);
