import { Router } from "express";
import {
  getEstadoInternetBanking,
  desconectarInternetBanking,
  conectarInternetBanking,
} from "../../../controllers/estado.controller";

const estadoRouter: Router = Router();

estadoRouter.get("/ib-arriba", getEstadoInternetBanking);
estadoRouter.put("/desconectar-ib", desconectarInternetBanking);
estadoRouter.put("/conectar-ib", conectarInternetBanking);

export default estadoRouter;
