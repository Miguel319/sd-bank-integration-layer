import { Router } from "express";
import prestamoMiddleware from "../middlewares/prestamo.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  processPrestamoPago,
  getPretamosByClienteId,
} from "../controllers/prestamo.controller";

const prestamoRouter: Router = Router();

prestamoRouter.get(
  "/cliente/:_id",
  prestamoMiddleware.getPretamosByClienteId,
  processCola,
  getPretamosByClienteId
);
prestamoRouter.put(
  "/:_id/pago",
  prestamoMiddleware.processPrestamoPago,
  processCola,
  processPrestamoPago
);

export default prestamoRouter;
