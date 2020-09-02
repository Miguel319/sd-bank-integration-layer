import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const UsuarioSchema = new Schema(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria."],
      unique: [true, "Ya existe un usuario con esta cédula."],
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
    sexo: {
      type: String,
      required: [true, "Debe proveer el 'sexo': Femenino o Masculino."],
      enum: ["Femenino", "Masculino"],
    },
    resetcontraseniaToken: String,
    resetcontraseniaExpire: Date,
    cuentas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    prestamos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Loan",
      },
    ],
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

// Encrypt contrasenia using bcryt
UsuarioSchema.pre("save", async function (next: any) {
  const thisRef: any = this;

  if (!thisRef.isModified("contrasenia")) next();

  const salt: any = await bcrypt.genSalt(10);
  thisRef.contrasenia = await bcrypt.hash(thisRef.contrasenia, salt);
});

UsuarioSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, (process as any).env.JWT_SECRET);
};

// Match user entered contrasenia to hashed contrasenia in db
UsuarioSchema.methods.matchPassword = async function (
  enteredcontrasenia: string
) {
  return await bcrypt.compare(enteredcontrasenia, this.contrasenia);
};

// Generate and hash contrasenia token
UsuarioSchema.methods.getResetPasswordToken = async function () {
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

export default mongoose.model("Usuario", UsuarioSchema);
