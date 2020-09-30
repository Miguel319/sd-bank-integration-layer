import { Router } from "express";
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
  .get(/*loggerMiddleware, */ getAllCajeros)
  .post(/*loggerMiddleware,  */ createCajero);

cajeroRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getCajeroById)
  .put(/*loggerMiddleware,  */ updateCajero)
  .delete(/*loggerMiddleware,  */ deleteCajero);

cajeroRouter.get("/por_cedula/:cedula", getCajeroByCedula);
cajeroRouter.get("/usuario-cajero/:_id", getUsuarioCajero);

cajeroRouter.post("/auth/signup", createUsuarioCajero);

export default cajeroRouter;
