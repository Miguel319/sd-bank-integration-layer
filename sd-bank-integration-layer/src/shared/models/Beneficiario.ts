import { Schema, model, Types } from "mongoose";

const { ObjectId } = Types;

const BeneficiarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del beneficiario es obligatorio."],
    },
    cedula: {
      type: String,
      required: [true, "Debe proveer la cédula del beneficiario."],
      min: [11, "La cédula debe tener 11 caracteres."],
      max: [11, "La cédula debe tener 11 caracteres."],
    },
    banco_beneficiario: {
      type: String,
      required: [true, "Debe proveer el nombre del banco."],
    },
    cuenta_beneficiario: {
      type: String,
      unique: true,
      required: [true, "Debe proveer el número de cuenta del beneficiario."],
    },
    cuenta_cliente: {
      type: ObjectId,
      ref: "Cuenta",
      required: [
        true,
        "Debe proveer el _id de la cuenta asociada al beneficiario.",
      ],
    },
    email: {
      type: String,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El formato del correo electrónico es inválido.",
      ],
    },
  },
  { timestamps: true }
);

export default model("Beneficiario", BeneficiarioSchema);
