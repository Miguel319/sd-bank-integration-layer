import {Router} from 'express';
import { getLoanById, getAllLoansByUser, createLoan,payLoanByUser } from '../controllers/loan.controller';

const  loanRouter: Router  = Router();

loanRouter.route("/:user_id").get(getAllLoansByUser);
loanRouter.route("/:_id").get(getLoanById).put(payLoanByUser);
loanRouter.post("",createLoan);

export default loanRouter;