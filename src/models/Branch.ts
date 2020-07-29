import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const BranchSchema = new Schema({
  city: {
    type: String,
    required: [true, "The city is mandatory."],
  },
  street: {
    type: String,
    required: [true, "The street name is mandatory."],
  },
  number: {
    type: String,
    required: [true, "The city is mandatory."],
  },
  zipCode:  String,
  address: {
    type: String,
    required: [true, "The address is mandatory."],
  },
  code: {
    type: String,
    required: [
      true,
      "A code must be provided to differentiate this branch from the other ones.",
    ],
  },
  cashiers: [
    {
      type: ObjectId,
      ref: "Cashier",
    },
  ],
  
});

BranchSchema.pre("save", function(next: any) {
  const thisRef: any = this;
  
  thisRef.address = `${thisRef.street} ${thisRef.number}, ${thisRef.zipCode}. ${thisRef.city}, República Dominicana.`;
  next();
});

export default mongoose.model("Branch", BranchSchema);
