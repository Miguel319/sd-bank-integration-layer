import clienteRouter from "./cliente.routes";
import authRouter from "./auth.routes";

export const setupInternetBankingRoutes = (app: any): void => {
  const BASE_URL: string = "/internet-banking-api/v1";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
  app.use(`${BASE_URL}/auth`, authRouter);
};
