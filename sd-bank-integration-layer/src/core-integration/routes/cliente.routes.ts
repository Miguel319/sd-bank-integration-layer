import { getClientes } from './../controllers/cliente.controller';
import { Router } from 'express';

const clienteRouter: Router = Router();

clienteRouter.get("", getClientes)

export default clienteRouter;