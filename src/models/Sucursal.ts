import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const SucursalSchema = new Schema({
  ciudad: {
    type: String,
    required: [true, "La ciudad es mandatoria."],
  },
  calle: {
    type: String,
    required: [true, "El nombre de la calle es obligatorio."],
  },
  numero: {
    type: String,
    required: [true, "El número de la casa es obligatorio."],
  },
  codigo_postal: {
    type: String,
    required: [
      true,
      "El código postal (codigo_postal) es obligatorio  obligatorio.",
    ],
  },
  direccion: String,
  codigo: {
    type: String,
    unique: [true, "Ya existe otra sucursal con ese código."],
    required: [
      true,
      "Debe proveer un código para diferenciar esta sucursal de las demás.",
    ],
  },
  cajeros: [
    {
      type: ObjectId,
      ref: "Cajero",
    },
  ],
});

SucursalSchema.pre("save", function (next: any) {
  const thisRef: any = this;

  thisRef.direccion = `${thisRef.calle} ${thisRef.numero}, ${thisRef.codigo_postal}. ${thisRef.ciudad}, República Dominicana.`;
  next();
});

SucursalSchema.pre("updateOne", function (next: any) {
  const thisRef: any = this;

  thisRef.direccion = `${thisRef.calle} ${thisRef.numero}, ${thisRef.codigo_postal}. ${thisRef.ciudad}, República Dominicana.`;
  next();
});

export default mongoose.model("Sucursal", SucursalSchema);
