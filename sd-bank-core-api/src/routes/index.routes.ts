import prestamoRouter from "./prestamo.routes";
import clienteRouter from "./cliente.routes";
import perfilRoutes from "./perfil.routes";
import authRouter from "./auth.routes";
import cuentaRouter from "./cuenta.routes";

export const setupRoutes = (app: any) => {
  const BASE_URL = "/core-api/v1";

  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRoutes);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
};
