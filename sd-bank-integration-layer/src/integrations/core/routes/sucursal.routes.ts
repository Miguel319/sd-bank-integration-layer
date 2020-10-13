import { Router } from "express";
import { getCajerosFromSucursal } from "../controllers/sucursal.controller";
import sucursalMiddleware from "../middlewares/sucursal.middleware";
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
  .get(
    sucursalMiddleware.getAllSucursales,
    /*loggerMiddleware,  */ getAllSucursales
  )
  .post(
    sucursalMiddleware.createSucursal,
    /*loggerMiddleware,  */ createSucursal
  );

sucursalRouter
  .route("/:_id")
  .get(
    sucursalMiddleware.getSucursalById,
    /*loggerMiddleware,  */ getSucursalById
  )
  .put(
    sucursalMiddleware.updateSucursal,
    /*loggerMiddleware,  */ updateSucursal
  )
  .delete(
    sucursalMiddleware.deleteSucursal,
    /*loggerMiddleware,  */ deleteSucursal
  );

sucursalRouter.get("/:_id/cajeros", getCajerosFromSucursal);

export default sucursalRouter;
