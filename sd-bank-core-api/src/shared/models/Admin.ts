import mongoose, { model, Schema, Types } from "mongoose";

const { ObjectId } = Types;

const AdminSchema = new Schema(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria."],
      unique: [true, "Ya existe un usuario con esta cédula."],
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
    sexo: {
      type: String,
      required: [true, "Debe especificar el 'sexo': Femenino o Masculino."],
      enum: ["Femenino", "Masculino"],
    },
    usuario: {
      type: ObjectId,
      ref: "Usuario",
    },
  },
  { timestamps: true }
);

export default model("Admin", AdminSchema);
