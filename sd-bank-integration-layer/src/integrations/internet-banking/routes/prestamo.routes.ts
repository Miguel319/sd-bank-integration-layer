import { Router } from "express";
import prestamoMiddleware from "../middlewares/prestamo.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  getPrestamoById,
  getAllPrestamosFromClienteId,
  payPrestamoByUser,
} from "../controllers/prestamo.controller";

const prestamoRouter = Router();

prestamoRouter.get(
  "/cliente/:_id",
  prestamoMiddleware.getAllPrestamosFromClienteId,
  processCola,
  getAllPrestamosFromClienteId
);

prestamoRouter.get(
  "/:_id",
  prestamoMiddleware.getPrestamoById,
  processCola,
  getPrestamoById
);

prestamoRouter.put(
  "/:_id/pago",
  prestamoMiddleware.payPrestamoByUser,
  processCola,
  payPrestamoByUser
);

export default prestamoRouter;
