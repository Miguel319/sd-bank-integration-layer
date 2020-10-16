import { Router } from "express";
import clienteMiddleware from "../middlewares/cliente.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  getClienteById,
  getClienteByCedula,
} from "../controllers/cliente.controller";

const clienteRouter = Router();

clienteRouter.get(
  "/:_id",
  clienteMiddleware.getClienteById,
  processCola,
  getClienteById
);

clienteRouter.get(
  "/por_cedula/:cedula",
  clienteMiddleware.getClienteByCedula,
  processCola,
  getClienteByCedula
);

export default clienteRouter;
