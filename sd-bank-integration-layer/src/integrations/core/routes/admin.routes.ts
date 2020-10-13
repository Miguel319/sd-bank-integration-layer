import {
    getAllAdmins,
    getAdminById,
    getAdminByCedula,
    createAdmin,
    updateAdmin,
    deleteAdmin
  } from "./../controllers/admin.controller";
  import { Router } from "express";
  
  const adminRouter: Router = Router();
  
  adminRouter
    .route("")
    .get(getAllAdmins)
    .post(createAdmin);

  adminRouter
    .route("/:_id")
    .get(getAdminById) 
    .put(updateAdmin)
    .delete(deleteAdmin);

 adminRouter
    .route("/:cedula")
    .get(getAdminByCedula);
  
  export default adminRouter;
  