import { Router } from "express";
import {
  getLoanById,
  getAllLoansByUser,
  createLoan,
  payLoanByUser,
} from "../controllers/prestamo.controller";

const loanRouter: Router = Router();

loanRouter.route("/:user_id").get(getAllLoansByUser);
loanRouter.route("/:_id").get(getLoanById);
loanRouter.put("/:_id/pay-loan", payLoanByUser);
loanRouter.post("", createLoan);

export default loanRouter;
