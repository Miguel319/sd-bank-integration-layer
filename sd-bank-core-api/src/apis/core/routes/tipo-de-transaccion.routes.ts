import { Router } from "express";
import {
  getAllTiposDeTransaccion,
  createTipoDeTransaccion,
  getTipoDeTransaccionById,
  updateTipoDeTransaccion,
  deleteTipoDeTransaccion,
} from "../controllers/tipo-de-transaccion.controller";

const tipoDeTransaccionRouter: Router = Router();

tipoDeTransaccionRouter
  .route("")
  .get(getAllTiposDeTransaccion)
  .post(createTipoDeTransaccion);

  tipoDeTransaccionRouter
  .route("/:_id")
  .get(getTipoDeTransaccionById)
  .put(updateTipoDeTransaccion)
  .delete(deleteTipoDeTransaccion);


export default tipoDeTransaccionRouter;