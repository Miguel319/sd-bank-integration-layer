import { errorHandler } from "./../middlewares/error.middleware";
import { Router } from "express";
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/cliente.controller";
import { loggerMiddleware } from "../middlewares/logger.middleware";

const clienteRouter: Router = Router();

clienteRouter
  .route("")
  .get(/*loggerMiddleware, */getAllClientes)
  .post(/*loggerMiddleware,  */createCliente);

clienteRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getClienteById)
  .post(/*loggerMiddleware,  */updateCliente)
  .delete(/*loggerMiddleware,  */deleteCliente);

export default clienteRouter;
