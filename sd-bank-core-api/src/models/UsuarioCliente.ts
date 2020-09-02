import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const { ObjectId } = Schema.Types;

const UsuarioClienteSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "El formato del correo electrónico es inválido.",
    ],
    required: [true, "El correo electrónico es obligatorio."],
  },
  contrasenia: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
    select: false,
    match: [
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$.%^&*])[\w!@#$.%^&*]{6,}$/,
      "La contraseña debe estar compuesta por letras mayúsculas y minúsculas, así como por números y caracteres especiales.",
    ],
  },
  cliente: {
    type: ObjectId,
    ref: "Cliente",
  },
  resetcontraseniaToken: String,
  resetcontraseniaExpire: Date,
});

// Encrypt contrasenia using bcryt
UsuarioClienteSchema.pre("save", async function (next: any) {
  const thisRef: any = this;

  if (!thisRef.isModified("contrasenia")) next();

  const salt: any = await bcrypt.genSalt(10);
  thisRef.contrasenia = await bcrypt.hash(thisRef.contrasenia, salt);
});

UsuarioClienteSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, (process as any).env.JWT_SECRET);
};

// Match user entered contrasenia to hashed contrasenia in db
UsuarioClienteSchema.methods.matchPassword = async function (
  enteredcontrasenia: string
) {
  return await bcrypt.compare(enteredcontrasenia, this.contrasenia);
};

// Generate and hash contrasenia token
UsuarioClienteSchema.methods.getResetPasswordToken = async function () {
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

export default mongoose.model("UsuarioCliente", UsuarioClienteSchema);
