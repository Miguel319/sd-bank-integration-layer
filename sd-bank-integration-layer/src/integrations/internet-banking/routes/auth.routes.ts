import { Router } from "express";
import {
  signin,
  signup,
  currentUser,
  fetchPerfiles,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get("/current-user", currentUser);
authRouter.get("/perfiles", /* protect,*/ fetchPerfiles);
authRouter.post("/signin", signin);
authRouter.post("/signup", signup);

export default authRouter;
