import { Router } from "express";
import { signIn } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signin", /*loggerMiddleware, */ signIn);

/*
cajeroRouter.put(
  "/:cedula/prestamos/:_id",
  loggerMiddleware,
  processPrestamoPago
);
*/

export default authRouter;
