import { Router } from "express";
import { signUp, signIn } from "../controllers/cajero.controller";

const cashierRouter: Router = Router();

cashierRouter.post("/sign-up", signUp);
cashierRouter.post("/sign-in", signIn);

export default cashierRouter;
