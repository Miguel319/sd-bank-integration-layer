import {
    getCuentas,
    getCuentaById,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    transactionHistory
  } from "./../controllers/cuenta.controller";
  import { Router } from "express";
  
  const cuentaRouter: Router = Router();
  
  cuentaRouter.route("").get(getCuentas).post(createCuenta); 
  cuentaRouter.route("/:_id").get(getCuentaById).put(updateCuenta).delete(deleteCuenta);
  cuentaRouter.route("/:_id/transactions").get(transactionHistory);
  
  export default cuentaRouter;
  