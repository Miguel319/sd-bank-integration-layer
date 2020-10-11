import { Router } from "express";
import {
  getPrestamoById,
  getAllPrestamosFromClienteId,
  payPrestamoByUser,
} from "../controllers/prestamo.controller";

const prestamoRouter = Router();

prestamoRouter.get("/cliente/:_id", getAllPrestamosFromClienteId);
prestamoRouter.get("/:_id", getPrestamoById);
prestamoRouter.put("/:_id/pago", payPrestamoByUser);

export default prestamoRouter;
