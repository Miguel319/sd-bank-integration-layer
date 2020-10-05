import { Router } from "express";
import {
  transferToMyself,
  interbankTransfer,
  getTipoTransaccionById,
  sameBankTransfer,
  getUserDetailsByAccountNo,
  depositFunds,
  getAccountDetailsById,
  transactionHistory,
  getClienteCuentasByClienteCedula,
  getTransaccionById
} from "../controllers/cuenta.controller";
import { getClienteCuentasByClienteId } from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.get("/:_id", getAccountDetailsById);
cuentaRouter.get("/:_id/transacciones", transactionHistory);
cuentaRouter.get("/cliente/:_id", getClienteCuentasByClienteId);
cuentaRouter.get(
  "/cliente/por-cedula/:cedula",
  getClienteCuentasByClienteCedula
);
cuentaRouter.get("/:numero_de_cuenta/detalles", getUserDetailsByAccountNo);

cuentaRouter.get("/transacciones/:_id/tipo", getTipoTransaccionById);
cuentaRouter.get("/transacciones/:_id", getTransaccionById);

cuentaRouter.put("/:_id/depositar", depositFunds);
cuentaRouter.put("/:_id/transferencia-personal", transferToMyself);
cuentaRouter.put("/:_id/transferencia-mismo-banco", sameBankTransfer);
cuentaRouter.put("/:_id/tansferencia-interbancaria", interbankTransfer);

export default cuentaRouter;
