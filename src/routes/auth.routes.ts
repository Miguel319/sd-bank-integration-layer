import { Router } from 'express';
import { signin, signup, currentUser, forgotPassword } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const authRouter: Router = Router();

authRouter.get("/current-user", protect, currentUser);
authRouter.post("/sign-in", signin);
authRouter.post("/sign-up", signup);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
