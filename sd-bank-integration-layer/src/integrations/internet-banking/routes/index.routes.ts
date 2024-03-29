import clienteRouter from "./cliente.routes";
import authRouter from "./auth.routes";
import cuentaRouter from "./cuenta.routes";
import prestamoRouter from "./prestamo.routes";
import estadoRouter from "./estado.routes";

export const internetBankingRoutes = (app: any): void => {
  const BASE_URL: string = "/internet-banking-api/v1";

  app.use(BASE_URL, estadoRouter);

  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
};
