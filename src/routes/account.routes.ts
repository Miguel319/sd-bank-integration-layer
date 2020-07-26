import { Router } from "express";
import { transferToMyself } from '../controllers/account.controller';
import {
  depositFunds,
  getAccountDetailsById,
  transactionHistory,
} from "../controllers/account.controller";
import {
  createAccount,
  getAllAccounts,
  getUserAccounts,
} from "../controllers/account.controller";

const accountRouter: Router = Router();

accountRouter.route("").get(getAllAccounts).post(createAccount);

accountRouter.get("/:_id", getAccountDetailsById);
accountRouter.get("/:_id/transactions", transactionHistory);
accountRouter.get("user/:_id", getUserAccounts);

accountRouter.put("/:_id/deposit", depositFunds);
accountRouter.put("/:_id/personal-transfer", transferToMyself);

export default accountRouter;
