import mongoose, { Schema } from "mongoose";

const BeneficiarySchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del beneficiario es obligatorio."],
  },
  tipo: {
    enum: ["cedula", "rnc"],
    type: String,
    required: [true, "El tipo debe ser cédula or RNC."],
  },
  id: {
    type: String,
    required: [true, "Debe proveer la cédula o el RNC."],
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
  cuenta_usuario: { // Se refiere a la cuenta asociada al beneficiario
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, "Debe proveer el _id de la cuenta asociada al beneficiario."],
  },
  email: {
    type: String,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El formato del correo electrónico es inválido."],
  },
});

export default mongoose.model("Beneficiary", BeneficiarySchema);
