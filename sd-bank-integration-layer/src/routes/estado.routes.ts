import { Router } from "express";
import {
  desconectarTeller,
  conectarTeller,
  getEstadoTeller,
  getEstadoInternetBanking,
  desconectarInternetBanking,
  conectarInternetBanking,
  getEstado,
  conectarSistema,
  desconectarSistema,
} from "../controllers/estado.controller";

const estadoRouter: Router = Router();

// CORE
estadoRouter.get("/arriba", getEstado);
estadoRouter.put("/desconectar", desconectarSistema);
estadoRouter.put("/conectar", conectarSistema);

// TELLER
estadoRouter.get("/teller-arriba", getEstadoTeller);
estadoRouter.put("/desconectar-teller", desconectarTeller);
estadoRouter.put("/conectar-teller", conectarTeller);

// Internet Banking
estadoRouter.get("/ib-arriba", getEstadoInternetBanking);
estadoRouter.put("/desconectar-ib", desconectarInternetBanking);
estadoRouter.put("/conectar-ib", conectarInternetBanking);

export default estadoRouter;
