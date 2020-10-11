import { Router } from "express";
import { signIn } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signin", /*loggerMiddleware, */ signIn);

export default authRouter;
