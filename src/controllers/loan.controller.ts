import { asyncHandler } from "../middlewares/async";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error-response";
import Loan from '../models/Loan'
import User from "../models/User";

export const getLoanById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const { _id } = req.params
    const loan = await Loan.findOne({_id});

    if(!loan){
       return next(new ErrorResponse("Loan not found",404));
    }

    res.status(200).json(loan);
});

export const getAllLoansByUser = asyncHandler (async(req: Request, res: Response, next: NextFunction) => {

    const { _id } = req.params;

    const user = await User.find({_id});

    if(!user){
        return next(new ErrorResponse("User not found",404));
    }

    const loans = await Loan.find({user})
    res.status(200).json(loans);

})

export const createLoan = asyncHandler(async (req: Request, res: Response,next: NextFunction) => {

    const {description, total, paid, remaining, user} = req.body;

    const newLoan = { description, total,  paid, remaining, user };

    await Loan.create(newLoan);
    res.status(201).json({success: true, message: "Loan created succesfully!."});
})
