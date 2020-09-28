import {
    getPerfiles,
    createPerfiles,
    getPerfilesById,
    updatePerfiles
  } 
  from "./../controllers/perfil.controller";
  import { Router } from "express";

  
  const prestamoRouter: Router = Router();
  
  prestamoRouter.route("").get(getPerfiles).post(createPerfiles);
  prestamoRouter.route("/:_id").get(getPerfilesById).put(updatePerfiles);
  
  export default prestamoRouter;