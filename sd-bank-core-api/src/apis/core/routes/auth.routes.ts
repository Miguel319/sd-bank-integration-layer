import { Router } from "express";
import { protect } from "../../../shared/middlewares/auth.middleware";
import {
  signin,
  signup,
  currentUser,
  forgotPassword,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get("/current-user", protect, currentUser);
authRouter.post("/sign-in", signin);
authRouter.post("/sign-up", signup);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
