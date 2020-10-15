import {
    getAllCajeros,
    getCajeroById,
    getCajeroByCedula,
    getUsuarioCajero,
    createCajero,
    createUsuarioCajero,
    updateCajero,
    deleteCajero
  } from "./../controllers/cajero.controller";
  import { Router } from "express";
  
  const cajeroRouter: Router = Router(); 

  cajeroRouter
  .route("")
  .get(getAllCajeros)
  .post(createCajero)
  .post(createUsuarioCajero);

  cajeroRouter
  .route("/:_id")
  .get(getCajeroById)
  .get(getUsuarioCajero)
  .put(updateCajero)
  .delete(deleteCajero);
  
  cajeroRouter
  .route("/:cedula")
  .get(getCajeroByCedula);

  export default cajeroRouter;
  