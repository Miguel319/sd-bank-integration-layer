import { internetBankingRoutes } from "../integrations/internet-banking/routes/index.routes";
import { tellerRoutes } from "../integrations/teller/routes/index.routes";
import estadoRouter from "./estado.routes";
import { coreIntegrationRoutes } from "../integrations/core/routes/index.routes";

const setupRoutes = (app: any): void => {
  app.use(`/api/v1`, estadoRouter);

  coreIntegrationRoutes(app);
  internetBankingRoutes(app);
  tellerRoutes(app);
};

export default setupRoutes;
