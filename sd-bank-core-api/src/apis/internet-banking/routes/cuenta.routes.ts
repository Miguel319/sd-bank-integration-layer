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
  getTransaccionById,
  getCuentaAndClienteByAccountNumber,
  getClienteCuentasByClienteId,
  getBeneficiariosMismoBanco,
  getInterbankTransferBeneficiarios,
} from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.get("/:_id", getAccountDetailsById);
cuentaRouter.get("/:_id/transacciones", transactionHistory);
cuentaRouter.get("/cliente/:_id", getClienteCuentasByClienteId);
cuentaRouter.get(
  "/cliente/por-cedula/:cedula",
  getClienteCuentasByClienteCedula
);

cuentaRouter.get("/:numero_de_cuenta/detalles", getUserDetailsByAccountNo);
cuentaRouter.get(
  "/:numero_de_cuenta/cliente/:_id/cliente-cuenta",
  getCuentaAndClienteByAccountNumber
);

cuentaRouter.get("/transacciones/:_id/tipo", getTipoTransaccionById);
cuentaRouter.get("/transacciones/:_id", getTransaccionById);
cuentaRouter.get("/:_id/beneficiarios-mismo-banco", getBeneficiariosMismoBanco);
cuentaRouter.get(
  "/:_id/beneficiarios-interbancarios",
  getInterbankTransferBeneficiarios
);

cuentaRouter.put("/:_id/depositar", depositFunds);
cuentaRouter.put("/:numero_de_cuenta/transferencia-personal", transferToMyself);
cuentaRouter.put("/:_id/transferencia-mismo-banco", sameBankTransfer);
cuentaRouter.put("/:_id/transferencia-interbancaria", interbankTransfer);

export default cuentaRouter;
