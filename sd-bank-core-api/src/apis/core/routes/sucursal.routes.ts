import { Router } from "express";
import { getCajerosFromSucursal } from "../controllers/sucursal.controller";
import {
  getSucursalById,
  createSucursal,
  getAllSucursales,
  updateSucursal,
  deleteSucursal,
} from "../controllers/sucursal.controller";

const sucursalRouter: Router = Router();

sucursalRouter
  .route("")
  .get(/*loggerMiddleware,  */ getAllSucursales)
  .post(/*loggerMiddleware,  */ createSucursal);

sucursalRouter
  .route("/:_id")
  .get(/*loggerMiddleware,  */ getSucursalById)
  .put(/*loggerMiddleware,  */ updateSucursal)
  .delete(/*loggerMiddleware,  */ deleteSucursal);

sucursalRouter.get("/:_id/cajeros", getCajerosFromSucursal);

export default sucursalRouter;
