import {
   getAllTiposDeTransaccion,
   getTipoDeTransaccionById,
   createTipoDeTransaccion,
   updateTipoDeTransaccion,
   DeleteTipoDeTransaccion
  } from "./../controllers/tipo-de-transaccion.controller";
  import { Router } from "express";
  
  const tipoTransaccion: Router = Router();
  
  tipoTransaccion.route("").get(getAllTiposDeTransaccion).post(createTipoDeTransaccion); 
  tipoTransaccion.route("/:_id").get(getTipoDeTransaccionById).put(updateTipoDeTransaccion).delete(DeleteTipoDeTransaccion);
  
  export default tipoTransaccion;
  