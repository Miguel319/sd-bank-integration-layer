import mongoose, { Schema } from "mongoose";

const TipoDeTransaccionSchema = new Schema(
  {
    tipo: {
      type: String,
      unique: [
        true,
        "Ya existe un tipo de transacción equivalente. Debe proveer uno diferente.",
      ],
      required: [true, "Debe proveer el tipo de transacción."],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TipoDeTransaccion", TipoDeTransaccionSchema);
