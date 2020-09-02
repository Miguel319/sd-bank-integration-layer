import {Router} from 'express';
import { getLoanById, getAllLoansByUser, createLoan,payLoanByUser } from '../controllers/prestamo.controller';
import {protectCashierRoute, identifyUser} from '../middlewares/cajero.middleware'

const  loanRouter: Router  = Router();

loanRouter.route("/:user_id").get(getAllLoansByUser);
loanRouter.route("/:_id").get(getLoanById);
loanRouter.put("/:_id/pay-loan", payLoanByUser);
loanRouter.post("", createLoan);

loanRouter.get("/payLoan", protectCashierRoute, identifyUser, payLoanByUser);
export default loanRouter;