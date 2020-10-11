import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const SucursalSchema = new Schema(
  {
    nombre: {
      type: String,
      unique: [true, "Ya existe otra sucursal con este mismo nombre."],
      required: [true, "El nombre es obligatorio."],
    },
    ciudad: {
      type: String,
      required: [true, "La ciudad es obligatoria."],
    },
    calle: {
      type: String,
      required: [true, "El nombre de la calle es obligatorio."],
    },
    numero: {
      type: String,
      required: [true, "El número es obligatorio."],
    },
    codigo_postal: {
      type: String,
      required: [true, "El código postal (codigo_postal) es obligatorio."],
    },
    direccion: String,
    cajeros: [
      {
        type: ObjectId,
        ref: "Cajero",
      },
    ],
  },
  { timestamps: true }
);

SucursalSchema.pre("save", function (next: any) {
  const thisRef: any = this;

  thisRef.direccion = `${thisRef.calle} ${thisRef.numero}. ${thisRef.ciudad}, República Dominicana. ${thisRef.codigo_postal}.`;
  next();
});

export default mongoose.model("Sucursal", SucursalSchema);
