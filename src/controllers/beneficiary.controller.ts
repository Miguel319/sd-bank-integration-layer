import { Request, Response, NextFunction } from "express";
import Beneficiary from "../models/Beneficiary";

type BeneficiaryType = {
    name: string;
    type: String;
    id: string;
    name_bank: string;
    beneficiary_account: string;
};

export const createBeneficiary = async (req: Request, res: Response,next: NextFunction) => {

    try{
        const {name, type, id, name_bank, beneficiary_account} = req.body; 

        //object to create
        const newBeneficiary: BeneficiaryType = {
            name,
            type, 
            id, 
            name_bank, 
            beneficiary_account
        }

        //validations logic

        //
        await Beneficiary.create(newBeneficiary)

        res.status(201).json({
            success: true,
            message: "Beneficiary created succesfully!."
        });

    }catch(error){

        res.status(400).json({
            success:false,
            error
        });

    }
    
}

export const getBeneficiaries = async(req: Request, res: Response, next: NextFunction) => {
    try{

        const beneficiaries = await Beneficiary.find({});

        res.status(200).json(beneficiaries)
        
    }catch(error){
        res.status(400).json({
            success:false,
            error
        });
    }

}
