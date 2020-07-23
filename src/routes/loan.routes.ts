import {Router} from 'express';
import { getLoanById, getAllLoansByUser } from '../controllers/loan.controller';

const  loanRouter: Router  = Router();

loanRouter.route("/:user_id").get(getAllLoansByUser);
loanRouter.route("/:_id").get(getLoanById);

export default loanRouter;