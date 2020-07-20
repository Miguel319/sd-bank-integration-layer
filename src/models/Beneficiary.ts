import mongoose,{ Schema, Types } from "mongoose";

const BeneficiarySchema = new Schema({
    
    name: {
        type: String,
        required: [true, "Name of beneficiary is required."],
    },
    type: {
        enum: ["cedula", "rnc"],
        type: String,
        required: [true, "type of beneficiary must be either cedula or rnc."]
    },
    id: {
        type: String,
        required: [true, "Cedula or rnc id must be provided"]
    },
    name_bank: {
        type: String,
        required: [true, "Bank of beneficiary must be provided."]
    },
    beneficiary_account: {
        type: String,
        required: [true, "Beneficiary account must be provided"]
    },
    // user_account: {
    //     type: Types.ObjectId,
    //     ref: "Account", 
    //     required: [true, "Account reference must be provided."]
    // },
    
});

export default mongoose.model("Beneficiary", BeneficiarySchema);