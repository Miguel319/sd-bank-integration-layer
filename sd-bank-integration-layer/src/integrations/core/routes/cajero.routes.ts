import { Router } from "express";
import cajeroMiddleware from "../middlewares/cajero.middleware";
import { processCola } from '../middlewares/cola.middleware';
import {
  getCajeroById,
  getAllCajeros,
  createUsuarioCajero,
  createCajero,
  deleteCajero,
  updateCajero,
  getCajeroByCedula,
  getUsuarioCajero,
} from "../controllers/cajero.controller";

const cajeroRouter: Router = Router();

cajeroRouter
  .route("")
  .get(cajeroMiddleware.getAllCajeros, processCola,/*loggerMiddleware, */ getAllCajeros)
  .post(cajeroMiddleware.createCajero, /*loggerMiddleware,  */ createCajero);

cajeroRouter
  .route("/:_id")
  .get(cajeroMiddleware.getCajeroById, /*loggerMiddleware,  */ getCajeroById)
  .put(cajeroMiddleware.updateCajero, /*loggerMiddleware,  */ updateCajero)
  .delete(cajeroMiddleware.deleteCajero, /*loggerMiddleware,  */ deleteCajero);

cajeroRouter.get(
  "/por_cedula/:cedula",
  cajeroMiddleware.getCajeroByCedula,
  getCajeroByCedula
);
cajeroRouter.get(
  "/usuario-cajero/:_id",
  cajeroMiddleware.getUsuarioCajero,
  getUsuarioCajero
);

cajeroRouter.post(
  "/auth/signup",
  cajeroMiddleware.createUsuarioCajero,
  createUsuarioCajero
);

export default cajeroRouter;
