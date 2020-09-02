import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const TransaccionSchema = new Schema(
  {
    cuenta: {
      type: ObjectId,
      ref: "Cuenta",
    },
    descripcion: String,
    cantidad: {
      type: Number,
      required: [true, "Debe especificar la cantidad de la transacción."],
    },
    tipo: {
      type: String,
      required: [true, "Debe especificar el tipo de transacción: Transferencia, Retiro, Compra o Depósito."],
      enum: ["Transferencia", "Retiro", "Compra", "Deposito"],
    },
    aprobada: {
      type: Boolean,
      default: true,
    },
    cantidad_en_transito: {
      type: Number,
      default: 0,
    },
    destinatario: {
      type: ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Transaccion", TransaccionSchema);
