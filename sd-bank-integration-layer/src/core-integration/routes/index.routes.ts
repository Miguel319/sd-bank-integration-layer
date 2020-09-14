import clienteRouter from "./cliente.routes";
import prestamoRouter from "./cliente.routes";

const coreIntegrationRoutes = (app: any): void => {
  const BASE_URL: string = "/api/v1/core";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
};

export default coreIntegrationRoutes;
