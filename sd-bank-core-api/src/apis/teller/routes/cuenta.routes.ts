import { Router } from "express";
import { processCuentaDeposito } from "../controllers/cuenta.controller";

const cuentaRouter: Router = Router();

cuentaRouter.put("/:numero_de_cuenta/deposito", processCuentaDeposito);

export default cuentaRouter;
