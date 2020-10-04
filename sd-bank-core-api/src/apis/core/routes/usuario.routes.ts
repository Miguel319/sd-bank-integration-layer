import { Router } from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  getEntidadesAsociadasByPerfil,
  deleteUsuario,
  getEntidadByUsuarioId,
} from "../controllers/usuario.controller";

const usuarioRouter: Router = Router();

usuarioRouter
  .route("")
  .get(/*loggerMiddleware,  */ getAllUsuarios)
  .post(/*loggerMiddleware,  */ createUsuario);

usuarioRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getUsuarioById)
  .put(/*loggerMiddleware,  */ updateUsuario)
  .delete(/*loggerMiddleware,  */ deleteUsuario);

usuarioRouter.get(
  "/perfil/:_id/entidades_asociadas",
  getEntidadesAsociadasByPerfil
);

usuarioRouter.get("/:_id/entidad", getEntidadByUsuarioId);

export default usuarioRouter;
