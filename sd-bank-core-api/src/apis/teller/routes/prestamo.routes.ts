import { Router } from "express";
import { processPrestamoPago } from "../controllers/prestamo.controller";

const prestamoRouter: Router = Router();

prestamoRouter.put("/:_id/pagar", processPrestamoPago);

export default prestamoRouter;
