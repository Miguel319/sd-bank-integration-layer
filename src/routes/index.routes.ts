import authRouter from "./auth.routes";
import beneficiaryRouter from "./beneficiary.routes";
import loanRouter from "./loan.routes";
import accountRouter from "./account.routes";

const setupRoutes = (app: any): void => {
  const BASE_URL: string = "/api/v1";

  // Routes
  app.use(`${BASE_URL}/accounts`, accountRouter);
  app.use(`${BASE_URL}/beneficiaries`, beneficiaryRouter);
  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/loans`, loanRouter);
};

export default setupRoutes;
