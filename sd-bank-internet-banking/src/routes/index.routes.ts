import clienteRouter from "./cliente.routes";

export const configureRoutes = (app: any) => {
  const BASE_URL: string = "/banking-api/v1";

  app.use(`${BASE_URL}/clientes`, clienteRouter);
};
