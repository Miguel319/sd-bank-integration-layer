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

});

export const createLoan = asyncHandler(async (req: Request, res: Response,next: NextFunction) => {

    const {description, total, user} = req.body;

    const newLoan = { description, total, remaining: Number(total), user};
    
    const userFound: any = await User.findById(user);

    if(!userFound){
        return next(new ErrorResponse("User not found",404));
    }
    
    const loan = await Loan.create(newLoan);
    
    userFound.loans.push((loan as any).id)

    await userFound.save();
    
    res.status(201).json({success: true, message: "Loan created succesfully!."});
});

export const payLoanByUser = asyncHandler ( async( req: Request, res: Response, next: NextFunction) =>{

    const { monto, user_id } = req.body;

    const { _id } = req.params;

    const montoNumber = Number(monto);

    const user: any = await User.findById(user_id);

    if(!user){
        return next(new ErrorResponse("User not found",404));
    }

    const userLoans = user.loans;

    const loanBelongsToUser = userLoans.find((x: any) => String(x) === String(_id))
    console.log('loanBelongsToUser', loanBelongsToUser);

    if(!loanBelongsToUser){
        return next(new ErrorResponse(`Provided loan ${_id} doesn't belong to this user.`,400));
    }

    const loan = await Loan.findOne({_id});

    if(!loan){
        return next(new ErrorResponse("Loan not found",404));
    }

    if((loan as any).paid === (loan as any).total){
        await Loan.deleteOne({_id});
        //cascade delete falta on user
        return res.status(200).json({success: true, message: "Loan was completely paid."});
    }

    if(montoNumber >= (loan as any).total){
        return next(new ErrorResponse("You can't exceed the total amount",400));
    }

    if(montoNumber > (loan as any).remaining){
        return next(new ErrorResponse("You can't exceed the remaining amount",400));
    }

    const updatePaid = (loan as any).paid + montoNumber;
    const updateRemaining = (loan as any).total - updatePaid;

    (loan as any).paid = updatePaid;
    (loan as any).remaining = updateRemaining;

    await loan.save();
    res.status(200).json({success: true, message: "Loan updated succesfully!."});
});
