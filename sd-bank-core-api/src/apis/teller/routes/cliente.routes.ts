import { Router } from "express";
import {
  getAllClientes,
  getClienteById,
  getClienteByCedula,
} from "../controllers/cliente.controller";

const clienteRouter: Router = Router();

clienteRouter.get("", /*loggerMiddleware, */ getAllClientes);

clienteRouter.get("/:_id", /*loggerMiddleware,  */ getClienteById);

clienteRouter.get("/por-cedula/:cedula", getClienteByCedula);

export default clienteRouter;
