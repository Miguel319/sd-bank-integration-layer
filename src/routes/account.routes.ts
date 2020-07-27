import { Router } from "express";
import {
  transferToMyself,
  sameBankTransfer,
  getUserDetailsByAccountNo,
} from "../controllers/account.controller";
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
accountRouter.get("/:account_no/user-details", getUserDetailsByAccountNo);

accountRouter.put("/:_id/deposit", depositFunds);
accountRouter.put("/:_id/personal-transfer", transferToMyself);
accountRouter.put("/:_id/same-bank-transfer", sameBankTransfer);

export default accountRouter;
