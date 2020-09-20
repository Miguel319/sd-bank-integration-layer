import { Router } from "express";

import {
  getCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  transactionHistory,
} from "../controllers/cuenta.controller";

const cuentaRouter = Router();

cuentaRouter.route("").get(getCuentas).post(createCuenta);

cuentaRouter
  .route("/:_id")
  .get(getCuentaById)
  .put(updateCuenta)
  .delete(deleteCuenta);

cuentaRouter.get("/:_id/transacciones", transactionHistory);

export default cuentaRouter;
