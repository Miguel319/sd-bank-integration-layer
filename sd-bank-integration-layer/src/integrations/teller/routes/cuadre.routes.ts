import { Router } from "express";
import {
  getAllCuadres,
  getCuadreById,
  createCuadre,
  getCuadresFromCajeroId,
  getOperacionesFromCuadreId,
} from "../controllers/cuadre.controller";
import cuadreMiddleware from "../middlewares/cuadre.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";

const cuadreRouter: Router = Router();

cuadreRouter.get(
  "",
  cuadreMiddleware.getAllCuadres,
  processCola,
  /*loggerMiddleware, */ getAllCuadres
);

cuadreRouter.get(
  "/:_id",
  cuadreMiddleware.getCuadreById,
  processCola,
  /*loggerMiddleware,  */ getCuadreById
);
cuadreRouter.get(
  "/:_id/operaciones",
  /*loggerMiddleware,  */ cuadreMiddleware.getOperacionesFromCuadreId,
  processCola,
  getOperacionesFromCuadreId
);
cuadreRouter.get(
  "/cajero/:_id",
  cuadreMiddleware.getCuadresFromCajeroId,
  getCuadresFromCajeroId
);
cuadreRouter.post("/cajero/:_id", cuadreMiddleware.createCuadre, createCuadre);

export default cuadreRouter;
