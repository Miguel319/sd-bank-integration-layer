import {Router} from 'express';
import { createBeneficiary, getBeneficiaries } from '../controllers/beneficiary.controller';

const  beneficiaryRouter: Router  = Router();

beneficiaryRouter.route("").post(createBeneficiary).get(getBeneficiaries);

export default beneficiaryRouter;