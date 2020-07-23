import { Router } from "express";
import { createAccount } from '../controllers/account.controller';

const accountRouter: Router = Router();

accountRouter.post("", createAccount);

export default accountRouter;
