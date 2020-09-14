import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", /*loggerMiddleware, */ signUp);
authRouter.post("/signin", /*loggerMiddleware, */ signIn);

/*
cajeroRouter.put(
  "/:cedula/prestamos/:_id",
  loggerMiddleware,
  processPrestamoPago
);
*/

export default authRouter;
