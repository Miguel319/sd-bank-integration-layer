import mongoose, { Schema, Types } from "mongoose";

const { ObjectId } = Schema.Types;

const CuentaSchema = new Schema(
  {
    tipo_de_cuenta: {
      type: String,
      enum: ["Corriente", "Ahorro"],
      required: [
        true,
        "Debe especificar el tipo de cuenta (Corriente o Ahorro).",
      ],
    },
    balance_disponible: {
      type: Number,
      default: 0,
    },
    balance_actual: {
      type: Number,
      default: 0,
    },
    numero_de_cuenta: {
      type: String,
      unique: [true, "El número de cuenta provisto ya está tomado."],
      minlength: [10, "El número de cuenta debe tener 10 caracteres."],
      maxlength: [10, "El número de cuenta debe tener 10 caracteres."],
    },
    balance_promedio_mensual: Number,
    cliente: {
      required: [
        true,
        "Esta cuenta debe pertenecer a un usuario. Debe proveer el '_id' de dicho usuario.",
      ],
      type: ObjectId,
      ref: "Cliente",
    },
    transacciones: [
      {
        type: ObjectId,
        ref: "Transaccion",
      },
    ],
    beneficiarios: [
      {
        type: ObjectId,
        ref: "Beneficiario",
      },
    ],
    cantidad_total_en_transito: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Cuenta", CuentaSchema);
