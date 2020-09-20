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
import { getUserAccounts } from "../controllers/cuenta.controller";

const accountRouter: Router = Router();

accountRouter.get("/:_id", getAccountDetailsById);
accountRouter.get("/:_id/transacciones", transactionHistory);
accountRouter.get("/user/:_id", getUserAccounts);
accountRouter.get("/:numero_de_cuenta/detalles", getUserDetailsByAccountNo);

accountRouter.put("/:_id/depositar", depositFunds);
accountRouter.put("/:_id/transferencia-personal", transferToMyself);
accountRouter.put("/:_id/transferencia-mismo-banco", sameBankTransfer);
accountRouter.put("/:_id/tansferencia-interbancaria", interbankTransfer);

export default accountRouter;
