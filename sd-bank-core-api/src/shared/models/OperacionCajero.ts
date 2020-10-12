import { model, Types, Schema } from "mongoose";

const { ObjectId } = Types;

const OperacionCajero = new Schema(
  {
    cajero: {
      required: [true, "Debe especificar el cajero asociado"],
      type: ObjectId,
      ref: "Cajero",
    },
    descripcion: {
      type: String,
      required: [true, "Debe proveer una descripción para esta operación."],
    },
    cuadre: {
      required: [true, "Debe especificar el cuadre asociado."],
      type: ObjectId,
      ref: "Cuadre",
    },
    monto: Number,
    tipo: {
      type: String,
      enum: ["Pago de prestamo", "Retiro", "Deposito"],
      required: [
        true,
        "Debe especificar el tipo de operación a realizar: 'Pago de prestamo', 'Retiro' o 'Deposito'",
      ],
    },
  },
  { timestamps: true }
);

export default model("OperacionCajero", OperacionCajero);
