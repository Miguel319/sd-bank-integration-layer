import {
  getClientes,
  createCliente,
  getClienteById
} from "./../controllers/cliente.controller";
import { Router } from "express";

const clienteRouter: Router = Router();

clienteRouter.route("").get(getClientes).post(createCliente);
clienteRouter.route("/:_id").get(getClienteById)


export default clienteRouter;
