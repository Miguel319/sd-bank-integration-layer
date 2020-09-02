import prestamoRouter from "./prestamo.routes";
import clienteRouter from "./cliente.routes";

export const setupRoutes = (app: any) => {
  const BASE_URL = "/core-api/v1";

  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/clientes`, clienteRouter);
};
