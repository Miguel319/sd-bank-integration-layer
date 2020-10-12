import {
  getClientes,
  createCliente,
  getClienteById,
  updateCliente,
  deleteCliente,
} from "./../controllers/cliente.controller";
import { Router } from "express";

const clienteRouter: Router = Router();

clienteRouter.route("").get(getClientes).post(createCliente);
clienteRouter
  .route("/:_id")
  .get(getClienteById)
  .put(updateCliente)
  .delete(deleteCliente);

export default clienteRouter;
