import {
    getSucursales,
    createSucursales,
    getSucursalesById,
    updateSucursales,
    deleteSucursales,
  } from "./../controllers/sucursal.controller";
  import { Router } from "express";
  
  const sucursalRouter: Router = Router();
  
  sucursalRouter.route("").get(getSucursales).post(createSucursales);
  sucursalRouter
    .route("/:_id")
    .get(getSucursalesById)
    .put(updateSucursales)
    .delete(deleteSucursales);
  
  export default sucursalRouter;