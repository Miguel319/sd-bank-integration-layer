import mongoose, { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ClienteSchema = new Schema(
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
    usuario_cliente: {
      type: ObjectId,
      ref: "UsuarioCliente",
    },
    cuentas_bancarias: [
      {
        type: ObjectId,
        ref: "Cuenta",
      },
    ],
    prestamos: [
      {
        type: ObjectId,
        ref: "Prestamo",
      },
    ],
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

export default mongoose.model("Cliente", ClienteSchema);
