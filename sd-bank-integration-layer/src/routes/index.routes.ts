import coreIntegrationRoutes from "../integrations/core/routes/index.routes";

const setupRoutes = (app: any): void => {
  coreIntegrationRoutes(app);
};

export default setupRoutes;
