import {
    getPrestamos,
    createPrestamo,
    getPrestamoById
  } from "./../controllers/prestamo.controller";
  import { Router } from "express";
  
  const prestamoRouter: Router = Router();
  
  prestamoRouter.route("").get(getPrestamos).post(createPrestamo);
  prestamoRouter.route("/:_id").get(getPrestamoById)
  
  
  export default prestamoRouter;