import { Router } from "express";
import {
  signin,
  signup,
  currentUser,
  forgotPassword,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get("/current-user", currentUser);
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
