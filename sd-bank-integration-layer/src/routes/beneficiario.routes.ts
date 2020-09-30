import {Router} from 'express';
import { createBeneficiary, getBeneficiaries,updateBeneficiary } from '../controllers/beneficiario.controller';

const  beneficiaryRouter: Router  = Router();

beneficiaryRouter.route("").post(createBeneficiary).get(getBeneficiaries);
beneficiaryRouter.route("/:_id").put(updateBeneficiary);

export default beneficiaryRouter;