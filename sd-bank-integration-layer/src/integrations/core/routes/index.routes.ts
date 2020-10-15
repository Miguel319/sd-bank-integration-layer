import prestamoRouter from "./prestamo.routes";
import clienteRouter from "./cliente.routes";
import perfilRoutes from "./perfil.routes";
import authRouter from "./auth.routes";
import cuentaRouter from "./cuenta.routes";
import tipoDeTransaccionRouter from "./tipo-de-transaccion.routes";
import adminRouter from "./admin.routes";
import sucursalRouter from "./sucursal.routes";
import cajeroRouter from "./cajero.routes";
import usuarioRouter from "./usuario.routes";

export const coreIntegrationRoutes = (app: any): void => {
  const BASE_URL = "/core-api/v1";

  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/admins`, adminRouter);
  app.use(`${BASE_URL}/cuentas`, cuentaRouter);
  app.use(`${BASE_URL}/perfiles`, perfilRoutes);
  app.use(`${BASE_URL}/prestamos`, prestamoRouter);
  app.use(`${BASE_URL}/tipo-de-transaccion`, tipoDeTransaccionRouter);
  app.use(`${BASE_URL}/sucursales`, sucursalRouter);
  app.use(`${BASE_URL}/cajeros`, cajeroRouter);
  app.use(`${BASE_URL}/usuarios`, usuarioRouter);
};
