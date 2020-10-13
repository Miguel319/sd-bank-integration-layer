import clienteRouter from "./cliente.routes";
import prestamoRouter from "./prestamo.routes";
import perfilRouter from "./perfil.routes";
import cuentaRouter from "./cuenta.routes";
import tipoTransaccion from "./tipo-de-transaccion.routes";
import admins from "./admin.routes";

const coreIntegrationRoutes = (app: any): void => {
  const BASE_URL: string = "/core-api/v1";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
  app.use(`${BASE_URL}/tipo-de-transaccion`, tipoTransaccion);
  app.use(`${BASE_URL}/admins`,admins);
};

export default coreIntegrationRoutes;
