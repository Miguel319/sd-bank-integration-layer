import { Router } from "express";
import cuentaMiddleware from "../middlewares/cuenta.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  processCuentaDeposito,
  processCuentaRetiro,
  getCuentasFromClienteCedula,
} from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.put(
  "/:numero_de_cuenta/deposito",
  cuentaMiddleware.processCuentaDeposito,
  processCola,
  processCuentaDeposito
);

cuentaRouter.get(
  "/cliente/:cedula",
  cuentaMiddleware.getCuentasFromClienteCedula,
  processCola,
  getCuentasFromClienteCedula
);

cuentaRouter.put(
  "/:numero_de_cuenta/retiro",
  cuentaMiddleware.processCuentaRetiro,
  processCola,
  processCuentaRetiro
);

export default cuentaRouter;
