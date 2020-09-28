import prestamoRouter from "./prestamo.routes";
import clienteRouter from "./cliente.routes";
import perfilRoutes from "./perfil.routes";
import authRouter from "./auth.routes";
import cuentaRouter from "./cuenta.routes";
import tipoDeTransaccionRouter from "./tipo-de-transaccion.routes";
import adminRouter from "./admin.routes";

export const setupCoreRoutes = (app: any): void => {
  const BASE_URL = "/core-api/v1";

  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/admins`, adminRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRoutes);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/tipo-de-transaccion`, tipoDeTransaccionRouter);
};
