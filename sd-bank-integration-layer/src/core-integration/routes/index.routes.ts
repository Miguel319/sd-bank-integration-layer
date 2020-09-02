import clienteRouter from "./cliente.routes";

const coreIntegrationRoutes = (app: any): void => {
  const BASE_URL: string = "/api/v1/core";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
};

export default coreIntegrationRoutes;
