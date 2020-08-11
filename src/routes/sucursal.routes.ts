import { Router } from "express";
import {
  createSucursal,
  getSucursales,
  getSucursalById,
  updateSucursal,
  deleteSucursal,
} from "../controllers/sucursal.controller";

const sucursalRouter: Router = Router();

sucursalRouter.route("").get(getSucursales).post(createSucursal);

sucursalRouter
  .route("/:_id")
  .get(getSucursalById)
  .put(updateSucursal)
  .delete(deleteSucursal);

export default sucursalRouter;
