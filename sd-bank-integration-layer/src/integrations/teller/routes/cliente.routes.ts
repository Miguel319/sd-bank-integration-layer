import { Router } from "express";
import clienteMiddleware from "../middlewares/cliente.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  getAllClientes,
  getClienteById,
  getClienteByCedula,
} from "../controllers/cliente.controller";

const clienteRouter: Router = Router();

clienteRouter.get(
  "",
  clienteMiddleware.getAllClientes,
  processCola,
  /*loggerMiddleware, */ getAllClientes
);

clienteRouter.get(
  "/:_id",
  clienteMiddleware.getClienteById,
  processCola,
  /*loggerMiddleware,  */ getClienteById
);

clienteRouter.get(
  "/por-cedula/:cedula",
  clienteMiddleware.getClienteByCedula,
  processCola,
  getClienteByCedula
);

export default clienteRouter;
