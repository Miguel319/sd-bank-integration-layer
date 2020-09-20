import prestamoRouter from "./prestamo.routes";
import clienteRouter from "./cliente.routes";
import perfilRouter from "./perfil.routes";

export const setupRoutes = (app: any) => {
  const BASE_URL = "/core-api/v1";

  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRouter);
};
