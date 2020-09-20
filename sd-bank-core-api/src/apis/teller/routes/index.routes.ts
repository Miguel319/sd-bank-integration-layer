import authRouter from "./auth.routes";
import cuentaRouter from "./cuenta.routes";
import prestamoRouter from "./prestamo.routes";

export const setupTellerRoutes = (app: any): void => {
  const BASE_URL: string = "/teller-api/v1";

  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
};
