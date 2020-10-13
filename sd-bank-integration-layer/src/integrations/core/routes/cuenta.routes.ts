import {
  getCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  transactionHistory,
} from "./../controllers/cuenta.controller";
import { Router } from "express";
import cuentaMiddleware from "../middlewares/cuenta.middleware";
import { processCola } from "../middlewares/cola.middleware";

const cuentaRouter: Router = Router();

cuentaRouter
  .route("")
  .get(cuentaMiddleware.getCuentas, processCola, getCuentas)
  .post(cuentaMiddleware.createCuenta, processCola, createCuenta);

cuentaRouter
  .route("/:_id")
  .get(cuentaMiddleware.getCuentaById, processCola, getCuentaById)
  .put(cuentaMiddleware.updateCuenta, processCola, updateCuenta)
  .delete(cuentaMiddleware.deleteCuenta, processCola, deleteCuenta);

cuentaRouter
  .route("/:_id/transactions")
  .get(cuentaMiddleware.transactionHistory, processCola, transactionHistory);

export default cuentaRouter;
