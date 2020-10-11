import { model, Schema, Types } from "mongoose";

const { ObjectId } = Types;

const Cuadre = new Schema(
  {
    cajero: {
      type: ObjectId,
      ref: "Cajero",
      required: [true, "Debe especificar el cajero asociado."],
    },
    balance_inicial: {
      type: Number,
      required: [true, "Debe especificar el balance inicial."],
    },
    balance_final: {
      type: Number,
    },
    monto_depositado: {
      type: Number,
      default: 0,
    },
    monto_retirado: {
      type: Number,
      default: 0,
    },
    clientes_atendidos: [
      {
        type: ObjectId,
        ref: "Cliente",
      },
    ],
    operaciones: [
      {
        type: ObjectId,
        ref: "OperacionCajero",
      },
    ],
  },
  { timestamps: true }
);

export default model("Cuadre", Cuadre);
