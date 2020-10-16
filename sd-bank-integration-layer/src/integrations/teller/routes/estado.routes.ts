import { Router } from "express";
import {
  desconectarTeller,
  conectarTeller,
  getEstadoTeller,
} from "../../../controllers/estado.controller";

const estadoRouter: Router = Router();

// TELLER
estadoRouter.get("/teller-arriba", getEstadoTeller);
estadoRouter.put("/conectar-teller", conectarTeller);
estadoRouter.put("/desconectar-teller", desconectarTeller);

export default estadoRouter;
