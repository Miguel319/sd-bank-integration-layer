import authRouter from "./auth.routes";
import beneficiaryRouter from "./beneficiario.routes";
import loanRouter from "./prestamo.routes";
import accountRouter from "./cuenta.routes";
import cashierRouter from "./cajero.routes";
import sucursalRouter from "./sucursal.routes";
import coreIntegrationRoutes from "../core-integration/routes/index.routes";
// import perfilRoutes from "./perfil.routes";

const setupRoutes = (app: any): void => {
  coreIntegrationRoutes(app);

  const BASE_URL: string = "/api/v1";

  // Routes
  app.use(`${BASE_URL}/accounts`, accountRouter);
  app.use(`${BASE_URL}/beneficiaries`, beneficiaryRouter);
  app.use(`${BASE_URL}/auth`, authRouter);
  app.use(`${BASE_URL}/loans`, loanRouter);
  app.use(`${BASE_URL}/cashier`, cashierRouter);
  app.use(`${BASE_URL}/sucursales`, sucursalRouter);
  // app.use(`${BASE_URL}/perfiles`, perfilRoutes);
};

export default setupRoutes;
