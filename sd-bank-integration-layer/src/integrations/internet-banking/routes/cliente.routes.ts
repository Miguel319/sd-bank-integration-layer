import { Router } from "express";
import {
  getClienteById,
  getClienteByCedula,
} from "../controllers/cliente.controller";

const clienteRouter = Router();

clienteRouter.get("/:_id", getClienteById);
clienteRouter.get("/por_cedula/:cedula", getClienteByCedula);

export default clienteRouter;
