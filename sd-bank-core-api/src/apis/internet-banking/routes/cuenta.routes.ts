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
  getClienteCuentasByClienteCedula,
} from "../controllers/cuenta.controller";
import { getClienteCuentasByClienteId } from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.get("/:_id", getAccountDetailsById);
cuentaRouter.get("/:_id/transacciones", transactionHistory);
cuentaRouter.get("/cliente/:_id", getClienteCuentasByClienteId);
cuentaRouter.get("/cliente/por-cedula/:cedula", getClienteCuentasByClienteCedula);
cuentaRouter.get("/:numero_de_cuenta/detalles", getUserDetailsByAccountNo);

cuentaRouter.put("/:_id/depositar", depositFunds);
cuentaRouter.put("/:_id/transferencia-personal", transferToMyself);
cuentaRouter.put("/:_id/transferencia-mismo-banco", sameBankTransfer);
cuentaRouter.put("/:_id/tansferencia-interbancaria", interbankTransfer);

export default cuentaRouter;
