import { processCola } from "./../middlewares/cola.middleware";
import {
  getPrestamos,
  createPrestamo,
  getPrestamoById,
  updatePrestamo,
} from "./../controllers/prestamo.controller";
import { Router } from "express";
import prestamoMiddleware from "../middlewares/prestamo.middleware";

const prestamoRouter: Router = Router();

prestamoRouter
  .route("")
  .get(prestamoMiddleware.getAllPrestamos, processCola, getPrestamos)
  .post(prestamoMiddleware.createPrestamo, processCola, createPrestamo);

prestamoRouter
  .route("/:_id")
  .get(prestamoMiddleware.getPrestamoById, processCola, getPrestamoById)
  .put(prestamoMiddleware.updatePrestamo, processCola, updatePrestamo);

export default prestamoRouter;
