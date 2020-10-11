import { Schema, model } from "mongoose";

const PerfilSchema = new Schema(
  {
    rol: {
      type: String,
      unique: [true, "Ya tenemos ese rol se registrado. Debe elegir otro."],
    },
    descripcion: {
      type: String,
      required: [true, "El campo descripción es obligatorio."],
    },
    tipo_entidad_asociada: {
      type: String,
      enum: ["Cliente", "Admin", "Cajero"],
      required: [true, "Debe especificar el tipo de entidad asociada."],
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default model("Perfil", PerfilSchema);
