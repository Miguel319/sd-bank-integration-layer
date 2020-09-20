import { Router } from "express";
import {
  processPrestamoPago,
  getPretamosByClienteId,
} from "../controllers/prestamo.controller";

const prestamoRouter: Router = Router();

prestamoRouter.get("/cliente/:_id", getPretamosByClienteId);
prestamoRouter.put("/:_id/pago", processPrestamoPago);

export default prestamoRouter;
