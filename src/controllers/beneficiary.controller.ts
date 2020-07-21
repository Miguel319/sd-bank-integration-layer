import { Request, Response, NextFunction } from "express";
import Beneficiary from "../models/Beneficiary";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../utils/error-response";

type BeneficiaryType = {
    name?: string;
    type?: String;
    id?: string;
    name_bank?: string;
    beneficiary_account?: string;
    email?: string;
};

export const createBeneficiary = asyncHandler(async (req: Request, res: Response,next: NextFunction) => {

    const {name, type, id, name_bank, beneficiary_account, email} = req.body; 

    //object to create
    const newBeneficiary:  BeneficiaryType = {
            name,
            type, 
            id, 
            name_bank, 
            beneficiary_account,
            email
    }

     //validations logic
    await Beneficiary.create(newBeneficiary)

    res.status(201).json({success: true, message: "Beneficiary created succesfully!."});
    
})

export const getBeneficiaries = asyncHandler (async(req: Request, res: Response, next: NextFunction) => {

    const beneficiaries = await Beneficiary.find({});
    res.status(200).json(beneficiaries)

})

export const updateBeneficiary = asyncHandler (async(req: Request, res: Response, next: NextFunction) =>{
    
    //filtro like
    //req.query  // google.com/?q=products&type=celular&page=5&color=white
    const { _id } = req.params // api/abc/products/423523523
    const beneficiary = await Beneficiary.findById(_id);
        
    if(!beneficiary){
        return next(new ErrorResponse("Beneficiary not found id", 404));
    }
    const {name, type, id , email} = req.body; 

    //object to update
    const updateBeneficiary: BeneficiaryType = {name, type, id, email}

    await Beneficiary.updateOne(beneficiary, updateBeneficiary);

    res.status(200).json({success: true, message: "Successfully updated beneficiary."});
    
})
