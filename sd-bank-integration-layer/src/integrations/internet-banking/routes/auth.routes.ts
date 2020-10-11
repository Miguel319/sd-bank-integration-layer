import { Router } from "express";
import { protect } from "../../../shared/middlewares/auth.middleware";
import {
  signin,
  signup,
  currentUser,
  fetchPerfiles,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get("/current-user", protect, currentUser);
authRouter.get("/perfiles", /* protect,*/ fetchPerfiles);
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);

export default authRouter;
