import { Router } from "express";
import { protect } from "../../../shared/middlewares/auth.middleware";
import { getPerfiles } from "../../core/controllers/perfil.controller";
import {
  signin,
  signup,
  currentUser,
  forgotPassword,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get("/current-user", protect, currentUser);
authRouter.get("/perfiles", /* protect,*/ getPerfiles);
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
