import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import TipoDeTransaccion from "../../../shared/models/TipoDeTransaccion";
import { NextFunction, Response, Request } from "express";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { ClientSession, startSession } from "mongoose";
import { notFound } from "../../../shared/utils/err.helpers";
import Transaccion from "../../../shared/models/Transaccion";
import ErrorResponse from "../../../shared/utils/error-response";

// @desc   GET tipos de transacción
// @route  GET /core-api/v1/tipo-de-transaccion
// @access Private
export const getAllTiposDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const prestamos = await TipoDeTransaccion.find({});

    res.status(200).json(prestamos);
  }
);

// @desc   GET tipos de transacción
// @route  GET /core-api/v1/tipo-de-transaccion
// @access Private
export const getTipoDeTransaccionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const tipoDeTransaccion = await TipoDeTransaccion.findById(_id);

    if (!tipoDeTransaccion)
      return notFound({
        message: "No se halló ningún tipo de transacción con el _id provisto.",
        next,
      });

    res.status(200).json(tipoDeTransaccion);
  }
);

// @desc   GET tipos de transacción
// @route  GET /core-api/v1/tipo-de-transaccion
// @access Private
export const createTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { tipo } = req.body;

      await TipoDeTransaccion.create([{ tipo }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        exito: true,
        mensaje: "Tipo de transacción creado satisfactoriamente.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

export const updateTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { tipo } = req.body;

    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const tipoDeTransaccionFound = await TipoDeTransaccion.findById(
        _id
      ).session(session);

      if (!tipoDeTransaccionFound)
        return notFound({
          message: "No se halló ningún tipo de transacción con el ID provisto.",
          next,
        });

      await TipoDeTransaccion.updateOne(
        tipoDeTransaccionFound,
        { tipo },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "Tipo de transacción actualizada satisfactoriamente.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

export const deleteTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const tipoDeTransaccion = await TipoDeTransaccion.findById(_id).session(
        session
      );

      if (!tipoDeTransaccion)
        return notFound({
          message:
            "No se halló ningún tipo de transacción con el _id provisto.",
          next,
        });

      const transaccionesAsociadas = await Transaccion.find({
        tipo_de_transaccion: tipoDeTransaccion._id,
      });

      if (transaccionesAsociadas.length > 0)
        return next(
          new ErrorResponse(
            "No puede eliminar este tipo de transacción porque tiene transacciones asociadas.",
            400
          )
        );

      await TipoDeTransaccion.deleteOne(tipoDeTransaccion, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "Tipo de transacción eliminada satisfactoriamente.",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
