import {
    getUsuarios,
    createUsuarios,
    getUsuariosById,
    updateUsuario,
    deleteUsuario,
  } from "./../controllers/usuario.controller";
  import { Router } from "express";
  
  const usuarioRouter: Router = Router();
  
  usuarioRouter.route("").get(getUsuarios).post(createUsuarios);
  usuarioRouter
    .route("/:_id")
    .get(getUsuariosById)
    .put(updateUsuario)
    .delete(deleteUsuario);
  
  export default usuarioRouter;