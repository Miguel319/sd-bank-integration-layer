import { Router } from "express";
import {
  processCuentaDeposito,
  processCuentaRetiro,
  getCuentasFromClienteCedula,
} from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.put("/:numero_de_cuenta/deposito", processCuentaDeposito);
cuentaRouter.get("/cliente/:cedula", getCuentasFromClienteCedula);
cuentaRouter.put("/:numero_de_cuenta/retiro", processCuentaRetiro);

export default cuentaRouter;
