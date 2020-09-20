import mongoose, { Schema } from "mongoose";

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
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Perfil", PerfilSchema);
