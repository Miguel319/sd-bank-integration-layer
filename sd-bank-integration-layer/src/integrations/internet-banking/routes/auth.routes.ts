import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { processCola } from "../../core/middlewares/cola.middleware";
import {
  signin,
  signup,
  currentUser,
  fetchPerfiles,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get(
  "/current-user",
  authMiddleware.currentUser,
  processCola,
  currentUser
);

authRouter.get(
  "/perfiles",
  authMiddleware.fetchPerfiles,
  processCola,
  /* protect,*/ fetchPerfiles
);

authRouter.post("/signin", authMiddleware.signin, processCola, signin);
authRouter.post("/signup", authMiddleware.signup, processCola, signup);

export default authRouter;
