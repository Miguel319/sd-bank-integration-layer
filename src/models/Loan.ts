import mongoose,{Schema}  from 'mongoose';

const LoanSchema = new Schema(
    {
        description: {
            type: String,
        },
        total: {
            type: Number,
            default: 0,
        },
        paid:{
            type: Number,
            default: 0,
        },
        remaining:{
            type: Number,
            default: 0,
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true, // created_at, updated_at
    }
);

LoanSchema.pre("save",function(next: any){
    const valueOfThis: any = this;
    valueOfThis.remaining = valueOfThis.total;
}); 

export default mongoose.model("Loan", LoanSchema);