import coreIntegrationRoutes from "../integrations/core/routes/index.routes";
import { internetBankingRoutes } from "../integrations/internet-banking/routes/index.routes";

const setupRoutes = (app: any): void => {
  coreIntegrationRoutes(app);
  internetBankingRoutes(app);
};

export default setupRoutes;
