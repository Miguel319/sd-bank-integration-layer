import { Router } from "express";
import usuarioMiddleware from "../middlewares/usuario.middleware";
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
  .get(usuarioMiddleware.getAllUsuarios, /*loggerMiddleware,  */ getAllUsuarios)
  .post(usuarioMiddleware.createUsuario, /*loggerMiddleware,  */ createUsuario);

usuarioRouter
  .route("/:_id")
  .get(usuarioMiddleware.getUsuarioById, /*loggerMiddleware,  */ getUsuarioById)
  .put(usuarioMiddleware.updateUsuario, /*loggerMiddleware,  */ updateUsuario)
  .delete(
    usuarioMiddleware.deleteUsuario,
    /*loggerMiddleware,  */ deleteUsuario
  );

usuarioRouter.get(
  "/perfil/:_id/entidades_asociadas",
  usuarioMiddleware.getEntidadesAsociadasByPerfil,
  getEntidadesAsociadasByPerfil
);

usuarioRouter.get(
  "/:_id/entidad",
  usuarioMiddleware.getEntidadByUsuarioId,
  getEntidadByUsuarioId
);

export default usuarioRouter;
