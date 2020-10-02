import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const CajeroSchema = new Schema(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria."],
      unique: [true, "Ya existe un cajero con esta cédula."],
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
    sucursal: {
      type: ObjectId,
      ref: "Sucursal",
    },
    usuario: {
      type: ObjectId,
      ref: "Usuario",
    },
    cuadres: [
      {
        type: ObjectId,
        ref: "Cuadre",
      },
    ],
    resetcontraseniaToken: String,
    resetcontraseniaExpire: Date,
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Cajero", CajeroSchema);
