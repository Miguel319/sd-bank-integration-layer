import { Router } from "express";
import {
  processPrestamoPago,
  signUp,
  signIn,
} from "../controllers/cajero.controller";
import { loggerMiddleware } from "../middlewares/logger.middleware";

const cajeroRouter = Router();

cajeroRouter.post("/signup", loggerMiddleware, signUp);
cajeroRouter.post("/signin", loggerMiddleware, signIn);

cajeroRouter.put(
  "/:cedula/prestamos/:_id",
  loggerMiddleware,
  processPrestamoPago
);

export default cajeroRouter;
