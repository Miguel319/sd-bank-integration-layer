import { processCola } from "./../middlewares/cola.middleware";
import {
  getPerfiles,
  createPerfil,
  getPerfilById,
  updatePerfil,
  deletePerfil,
} from "./../controllers/perfil.controller";
import { Router } from "express";
import perfilMiddleware from "../middlewares/perfil.middleware";

const perfilRouter: Router = Router();

perfilRouter
  .route("")
  .get(perfilMiddleware.getPerfiles, processCola, getPerfiles)
  .post(perfilMiddleware.createPerfil, processCola, createPerfil);

perfilRouter
  .route("/:_id")
  .get(perfilMiddleware.getPerfilPorId, processCola, getPerfilById)
  .put(perfilMiddleware.updatePerfil, processCola, updatePerfil)
  .delete(perfilMiddleware.deletePerfil, processCola, deletePerfil);

export default perfilRouter;
