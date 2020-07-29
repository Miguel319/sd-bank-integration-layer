import authRouter from "./auth.routes";
import beneficiaryRouter from "./beneficiary.routes";
import loanRouter from "./loan.routes";
import accountRouter from "./account.routes";
import cashierRouter from './cashier.routes';

const setupRoutes = (app: any): void => {
  const BASE_URL: string = "/api/v1";

  // Routes
  app.use(`${BASE_URL}/accounts`, accountRouter);
  app.use(`${BASE_URL}/beneficiaries`, beneficiaryRouter);
  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/loans`, loanRouter);
  app.use(`${BASE_URL}/cashier`, cashierRouter);

};

export default setupRoutes;
