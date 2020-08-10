import {Router} from 'express';
import {createCashier, signIn} from '../controllers/cashier.controller'

const  cashierRouter: Router  = Router();

cashierRouter.post("",createCashier);
cashierRouter.post("/sign-up", signIn);

export default cashierRouter;