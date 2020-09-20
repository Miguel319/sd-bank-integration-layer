import { Router } from "express";
import { getAllPrestamos } from "../controllers/prestamo.controller";
import {
  getPrestamoById,
  getAllPrestamosByUser,
  createPrestamo,
  updatePrestamo,
} from "../controllers/prestamo.controller";

const prestamoRouter: Router = Router();

prestamoRouter.get(
  "/cliente/:cliente_id",
  /*loggerMiddleware, */
  getAllPrestamosByUser
);

prestamoRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getPrestamoById)
  .put(/*loggerMiddleware,  */ updatePrestamo);

prestamoRouter
  .route("")
  .get(/*loggerMiddleware,  */ getAllPrestamos)
  .post(/*loggerMiddleware,  */ createPrestamo);

export default prestamoRouter;
