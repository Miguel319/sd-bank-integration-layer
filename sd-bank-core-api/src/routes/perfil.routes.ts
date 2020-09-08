import { Router } from "express";

import {
  getPerfiles,
  createPerfil,
  deletePerfil,
  updatePerfil,
} from "../controllers/perfil.controller";
import { loggerMiddleware } from "../middlewares/logger.middleware";
import { getPerfilPorId } from "../controllers/perfil.controller";

const perfilRoutes = Router();

perfilRoutes
  .route("")
  .get(/*loggerMiddleware,  */getPerfiles)
  .post(/*loggerMiddleware,  */createPerfil);

perfilRoutes
  .route("/:_id")
  .get(loggerMiddleware, getPerfilPorId)
  .put(loggerMiddleware, updatePerfil)
  .delete(loggerMiddleware, deletePerfil);

export default perfilRoutes;
