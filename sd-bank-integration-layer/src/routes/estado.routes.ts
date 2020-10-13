import { Router } from "express";
import {
  getEstado,
  conectarSistema,
  desconectarSistema,
} from "../controllers/estado.controller";

const estadoRouter: Router = Router();

estadoRouter.get("/arriba", getEstado);

estadoRouter.put("/desconectar", desconectarSistema);

estadoRouter.put("/conectar", conectarSistema);

export default estadoRouter;
