import { Router } from "express";
import { interbankTransfer } from "../controllers/cuenta.controller";
import {
  transferToMyself,
  sameBankTransfer,
  getUserDetailsByAccountNo,
} from "../controllers/cuenta.controller";
import {
  depositFunds,
  getAccountDetailsById,
  transactionHistory,
} from "../controllers/cuenta.controller";
import {
  createAccount,
  getAllAccounts,
  getUserAccounts,
} from "../controllers/cuenta.controller";

const accountRouter: Router = Router();

accountRouter.route("").get(getAllAccounts).post(createAccount);

accountRouter.get("/:_id", getAccountDetailsById);
accountRouter.get("/:_id/transactions", transactionHistory);
accountRouter.get("/user/:_id", getUserAccounts);
accountRouter.get("/:account_no/user-details", getUserDetailsByAccountNo);

accountRouter.put("/:_id/deposit", depositFunds);
accountRouter.put("/:_id/personal-transfer", transferToMyself);
accountRouter.put("/:_id/same-bank-transfer", sameBankTransfer);
accountRouter.put("/:_id/interbank-transfer", interbankTransfer);

export default accountRouter;
