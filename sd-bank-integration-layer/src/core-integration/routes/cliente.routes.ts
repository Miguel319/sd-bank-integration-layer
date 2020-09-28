import {
  getClientes,
  createCliente,
  getClienteById,
  updateCliente
} from "./../controllers/cliente.controller";
import { Router } from "express";

const clienteRouter: Router = Router();

clienteRouter.route("").get(getClientes).post(createCliente);
clienteRouter.route("/:_id").get(getClienteById).put(updateCliente);


export default clienteRouter;
