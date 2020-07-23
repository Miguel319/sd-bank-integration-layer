import { Request, Response, NextFunction } from "express";
import Beneficiary from "../models/Beneficiary";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../utils/error-response";
import Account from "../models/Account";
import User from "../models/User";

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
    
     // 1. search for beneficiary if beneficiary_account is from sd-bank -> return name, type, id
    const account = await Account.find({beneficiary_account});

    const beneficiary: BeneficiaryType ={name,type,id,name_bank,beneficiary_account,email}
    
    if(account){
        const _id = (account as any)._id;
        const user = await User.find({_id});

        beneficiary.name = `${(user as any).name} ${(user as any).lastName}`;
        beneficiary.email = (user as any).email;
        beneficiary.name_bank = "SD Bank";
        //beneficiary.id = (user as any).id
        beneficiary.beneficiary_account = (account as any).account_number;

        await Beneficiary.create(beneficiary)
        res.status(201).json({success: true, message: "Beneficiary created succesfully!."});
    }
    
    //sender
    await Beneficiary.create(beneficiary)
    res.status(201).json({success: true, message: "Beneficiary created succesfully!."});
    
})

export const getBeneficiaries = asyncHandler (async(req: Request, res: Response, next: NextFunction) => {

    const beneficiaries = await Beneficiary.find({});
    res.status(200).json(beneficiaries)

})

export const updateBeneficiary = asyncHandler(async(req: Request, res: Response, next: NextFunction) =>{

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
});

export const deleteBeneficiary = asyncHandler(async(req: Request, res: Response, next: NextFunction): Promise<void | Response> =>{

    const { _id } = req.params 
    await Beneficiary.findOneAndDelete({_id});

    res.status(200).json({success: true, message: "Successfully delete beneficiary."});
});

export const getBeneficiaryById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const { _id } = req.params
    const beneficiary = await Beneficiary.findOne({_id});

    if(!beneficiary){
       return next(new ErrorResponse("Beneficiary not found",404));
    }

    res.status(200).json(beneficiary);
});
