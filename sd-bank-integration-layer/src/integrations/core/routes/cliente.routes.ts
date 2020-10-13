import {
  getClientes,
  createCliente,
  getClienteById,
  updateCliente,
  deleteCliente,
} from "./../controllers/cliente.controller";

import { Router } from "express";
import clienteMiddleware from "../middlewares/cliente.middleware";
import { processCola } from "../middlewares/cola.middleware";

const clienteRouter: Router = Router();

clienteRouter
  .route("")
  .get(clienteMiddleware.getAllClientes, processCola, getClientes)
  .post(clienteMiddleware.createCliente, processCola, createCliente);
clienteRouter
  .route("/:_id")
  .get(clienteMiddleware.getClienteById, processCola, getClienteById)
  .put(clienteMiddleware.updateCliente, processCola, updateCliente)
  .delete(clienteMiddleware.deleteCliente, processCola, deleteCliente);

export default clienteRouter;
