import { Router } from "express";
import { processCola } from "../../core/middlewares/cola.middleware";
import cuentaMiddleware from "../middlewares/cuenta.middleware";
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
  getBeneficiariosFromCuenta,
  agregarBeneficiario,
  deleteBeneficiario,
} from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.get(
  "/:_id",
  cuentaMiddleware.getAccountDetailsById,
  processCola,
  getAccountDetailsById
);

cuentaRouter.get(
  "/:_id/transacciones",
  cuentaMiddleware.transactionHistory,
  processCola,
  transactionHistory
);

cuentaRouter.get(
  "/cliente/:_id",
  cuentaMiddleware.getClienteCuentasByClienteId,
  processCola,
  getClienteCuentasByClienteId
);

cuentaRouter.get(
  "/cliente/por-cedula/:cedula",
  cuentaMiddleware.getClienteCuentasByClienteCedula,
  processCola,
  getClienteCuentasByClienteCedula
);

cuentaRouter.get(
  "/:numero_de_cuenta/detalles",
  cuentaMiddleware.getUserDetailsByAccountNo,
  processCola,
  getUserDetailsByAccountNo
);
cuentaRouter.get(
  "/:numero_de_cuenta/cliente/:_id/cliente-cuenta",
  cuentaMiddleware.getCuentaAndClienteByAccountNumber,
  processCola,
  getCuentaAndClienteByAccountNumber
);

cuentaRouter.get(
  "/transacciones/:_id/tipo",
  cuentaMiddleware.getTipoTransaccionById,
  processCola,
  getTipoTransaccionById
);
cuentaRouter.get(
  "/transacciones/:_id",
  cuentaMiddleware.getTransaccionById,
  processCola,
  getTransaccionById
);

cuentaRouter
  .route("/:_id/beneficiarios")
  .get(
    cuentaMiddleware.getBeneficiariosFromCuenta,
    processCola,
    getBeneficiariosFromCuenta
  )
  .post(cuentaMiddleware.agregarBeneficiario, processCola, agregarBeneficiario);

cuentaRouter.get(
  "/:_id/beneficiarios-mismo-banco",
  cuentaMiddleware.getBeneficiariosMismoBanco,
  processCola,
  getBeneficiariosMismoBanco
);

cuentaRouter.get(
  "/:_id/beneficiarios-interbancarios",
  cuentaMiddleware.getInterbankTransferBeneficiarios,
  processCola,
  getInterbankTransferBeneficiarios
);

cuentaRouter.put(
  "/:_id/depositar",
  cuentaMiddleware.depositFunds,
  processCola,
  depositFunds
);

cuentaRouter.put(
  "/:numero_de_cuenta/transferencia-personal",
  cuentaMiddleware.transferToMyself,
  processCola,
  transferToMyself
);

cuentaRouter.put(
  "/:_id/transferencia-mismo-banco",
  cuentaMiddleware.sameBankTransfer,
  processCola,
  sameBankTransfer
);

cuentaRouter.put(
  "/:_id/transferencia-interbancaria",
  cuentaMiddleware.interbankTransfer,
  processCola,
  interbankTransfer
);

cuentaRouter.delete(
  "/beneficiarios/:_id",
  cuentaMiddleware.deleteBeneficiario,
  processCola,
  deleteBeneficiario
);

export default cuentaRouter;
