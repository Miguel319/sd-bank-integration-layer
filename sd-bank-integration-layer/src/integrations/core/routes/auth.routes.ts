import { Router } from "express";
import { signin, signup, currentUser } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { processCola } from "../middlewares/cola.middleware";

const authRouter: Router = Router();

authRouter.get(
  "/current-user",
  authMiddleware.currentUser,
  processCola,
  currentUser
);
authRouter.post("/signin", authMiddleware.signin, processCola, signin);
authRouter.post("/signup", authMiddleware.signup, processCola, signup);

export default authRouter;
