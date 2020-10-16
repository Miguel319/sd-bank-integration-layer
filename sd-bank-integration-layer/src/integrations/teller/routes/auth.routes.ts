import { Router } from "express";
import { signIn } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { processCola } from '../../core/middlewares/cola.middleware';

const authRouter = Router();

authRouter.post(
  "/signin",
  authMiddleware.signIn,
  processCola,
  /*loggerMiddleware, */ signIn
);

export default authRouter;
