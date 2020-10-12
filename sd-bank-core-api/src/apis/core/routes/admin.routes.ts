import { Router } from "express";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminByCedula,
} from "../controllers/admin.controller";

const adminRouter: Router = Router();

adminRouter
  .route("")
  .get(/*loggerMiddleware, */ getAllAdmins)
  .post(/*loggerMiddleware,  */ createAdmin);

adminRouter.get("/por_cedula/:cedula", getAdminByCedula);

adminRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getAdminById)
  .put(/*loggerMiddleware,  */ updateAdmin)
  .post(/*loggerMiddleware,  */ updateAdmin)
  .delete(/*loggerMiddleware,  */ deleteAdmin);

export default adminRouter;
