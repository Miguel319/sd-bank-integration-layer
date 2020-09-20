import mongoose, { Schema, Types } from "mongoose";
// import intFormat from "biguint-format";
// import FlakeId from "flake-idgen";

const { ObjectId } = Schema.Types;

const CuentaSchema = new Schema(
  {
    tipo_de_cuenta: {
      type: String,
      enum: ["Cheques", "Ahorro"],
      required: [
        true,
        "Debe especificar el tipo de cuenta (Cheques o Ahorro).",
      ],
    },
    balance_disponible: {
      type: Number,
      default: 0,
    },
    balance_actual: {
      type: Number,
      default: 0,
    },
    numero_de_cuenta: {
      type: String,
      unique: [true, "El número de cuenta provisto ya está tomado."],
      minlength: [10, "El número de cuenta debe tener 10 caracteres."],
      maxlength: [10, "El número de cuenta debe tener 10 caracteres."],
    },
    balance_promedio_mensual: Number,
    cliente: {
      required: [
        true,
        "Esta cuenta debe pertenecer a un usuario. Debe proveer el '_id' de dicho usuario.",
      ],
      type: ObjectId,
      ref: "Cliente",
    },
    transacciones: [
      {
        type: ObjectId,
        ref: "Transaccion",
      },
    ],
    cantidad_total_en_transito: {
      type: Number,
      default: 0,
    },
    prestamos: {
      type: ObjectId,
      ref: "Prestamo",
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

// Create a random but unique 12-digit account number
/*AccountSchema.pre("save", function (next: any) {
  const generator: FlakeId = new FlakeId();

//   const uniqueAccNo: Buffer = generator.next();
//   const uniqueAccNoFormat: string = String(intFormat(uniqueAccNo)).slice(0, 12);

  (this as any).account_number = uniqueAccNoFormat;
  next();
});
*/
export default mongoose.model("Cuenta", CuentaSchema);
