import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const PrestamoSchema = new Schema(
  {
    descripcion: {
      type: String,
      required: [true, "Debe proveer una descripción del préstamo."]
    },
    cantidad_total: {
      type: Number,
      required: [true, "Debe especificar la 'cantidad_total' del préstamo."],
    },
    cantidad_saldada: {
      type: Number,
      default: 0,
    },
    cantidad_restante: {
      type: Number,
      default: 0,
    },
    aprobado: {
      type: Boolean,
      default: true
    },
    usuario: {
      required: [true, "Debe especificar el usuario asociado a este préstamo."],
      type: ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Prestamo", PrestamoSchema);
