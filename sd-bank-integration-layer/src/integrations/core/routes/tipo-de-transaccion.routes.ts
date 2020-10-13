import {
  getAllTiposDeTransaccion,
  getTipoDeTransaccionById,
  createTipoDeTransaccion,
  updateTipoDeTransaccion,
  deleteTipoDeTransaccion,
} from "./../controllers/tipo-de-transaccion.controller";
import { Router } from "express";
import tipoDeTransaccionMiddleware from "../middlewares/tipo-de-transaccion.middleware";

const tipoTransaccion: Router = Router();

tipoTransaccion
  .route("")
  .get(
    tipoDeTransaccionMiddleware.getAllTiposDeTransaccion,
    getAllTiposDeTransaccion
  )
  .post(
    tipoDeTransaccionMiddleware.createTipoDeTransaccion,
    createTipoDeTransaccion
  );

tipoTransaccion
  .route("/:_id")
  .get(
    tipoDeTransaccionMiddleware.getTipoDeTransaccionById,
    getTipoDeTransaccionById
  )
  .put(
    tipoDeTransaccionMiddleware.updateTipoDeTransaccion,
    updateTipoDeTransaccion
  )
  .delete(
    tipoDeTransaccionMiddleware.deleteTipoDeTransaccion,
    deleteTipoDeTransaccion
  );

export default tipoTransaccion;
