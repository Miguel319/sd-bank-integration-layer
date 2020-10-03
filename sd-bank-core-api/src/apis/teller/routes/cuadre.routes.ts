import { Router } from "express";
import {
  getCuadresFromCajeroId,
  getOperacionesFromCuadreId,
} from "../controllers/cuadre.controller";
import {
  getAllCuadres,
  getCuadreById,
  createCuadre,
} from "../controllers/cuadre.controller";

const cuadreRouter: Router = Router();

cuadreRouter.get("", /*loggerMiddleware, */ getAllCuadres);

cuadreRouter.get("/:_id", /*loggerMiddleware,  */ getCuadreById);
cuadreRouter.get(
  "/:_id/operaciones",
  /*loggerMiddleware,  */ getOperacionesFromCuadreId
);
cuadreRouter.get("/cajero/:_id", getCuadresFromCajeroId);
cuadreRouter.post("/cajero/:_id", createCuadre);

export default cuadreRouter;
