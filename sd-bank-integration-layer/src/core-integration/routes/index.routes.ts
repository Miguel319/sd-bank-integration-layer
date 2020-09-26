import clienteRouter from "./cliente.routes";
import prestamoRouter from "./prestamo.routes";
import perfilRouter from "./perfil.routes";
import cuentaRouter from "./cuenta.routes";

const coreIntegrationRoutes = (app: any): void => {
  const BASE_URL: string = "/api/v1/core";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
};

export default coreIntegrationRoutes;
