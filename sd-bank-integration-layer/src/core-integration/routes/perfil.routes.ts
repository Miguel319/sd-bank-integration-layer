import {
    getPerfiles
  } 
  from "./../controllers/perfil.controller";
  import { Router } from "express";

  
  const prestamoRouter: Router = Router();
  
  prestamoRouter.route("").get(getPerfiles)
  
  
  export default prestamoRouter;