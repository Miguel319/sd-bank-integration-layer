import { Router } from "express";
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/cliente.controller";

const clienteRouter: Router = Router();

clienteRouter
  .route("")
  .get(/*loggerMiddleware, */getAllClientes)
  .post(/*loggerMiddleware,  */createCliente);

clienteRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getClienteById)
  .put(/*loggerMiddleware,  */updateCliente)
  .delete(/*loggerMiddleware,  */deleteCliente);

export default clienteRouter;
