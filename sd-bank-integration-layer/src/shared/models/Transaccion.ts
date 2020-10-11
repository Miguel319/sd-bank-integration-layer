import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const TransaccionSchema = new Schema(
  {
    tipo_entidad_asociada: {
      type: String,
      required: [
        true,
        "Debe especificar el tipo de la entidad asociada ('tipo_entidad_asociada'): Cuenta o Prestamo.",
      ],
      enum: ["Cuenta", "Prestamo"],
    },
    entidad_asociada: {
      type: ObjectId,
      refPath: "tipo_entidad_asociada",
    },
    descripcion: String,
    cantidad: {
      type: Number,
      required: [true, "Debe especificar la cantidad de la transacción."],
    },
    tipo: {
      type: ObjectId,
      ref: "TipoDeTransaccion",
      required: [true, "Debe especificar el tipo de transacción."],
    },
    aprobada: {
      type: Boolean,
      default: true,
    },
    balance_anterior: {
      type: Number,
    },
    balance_posterior: {
      type: Number,
    },
    cantidad_en_transito: {
      type: Number,
      default: 0,
    },
    destinatario: {
      type: ObjectId,
      ref: "Cliente",
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Transaccion", TransaccionSchema);
