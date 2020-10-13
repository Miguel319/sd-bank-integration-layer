import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import { ClientSession, startSession } from "mongoose";
import Sucursal from "../../../shared/models/Sucursal";
import ErrorResponse from "../../../shared/utils/error-response";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { notFound } from "../../../shared/utils/err.helpers";
import { getSucursalFieldsToUpdt } from "../utils/sucursal.helpers";
import Cajero from "../../../shared/models/Cajero";

export const createSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

      const sucursalACrear = {
        nombre,
        ciudad,
        calle,
        numero,
        codigo_postal,
      };

      await Sucursal.create([sucursalACrear], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "¡Sucursal creada satisfactoriamente!",
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(err, req, res, next);
    }
  }
);

export const getCajerosFromSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const cajeros = await Cajero.find({ sucursal: _id });

    res.status(200).json(cajeros);
  }
);

export const getSucursalById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const sucursal = await Sucursal.findById(_id);

    res.status(200).json(sucursal);
  }
);

export const getAllSucursales = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const sucursales = await Sucursal.find({});

    res.status(200).json(sucursales);
  }
);

export const updateSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { _id } = req.params;

      const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

      const areFieldsValid = getSucursalFieldsToUpdt(req);

      if (!areFieldsValid)
        return next(
          new ErrorResponse(
            "Debe proveer al menos un campo para realizar la actualización.",
            400
          )
        );

      const sucursalFound: any = await Sucursal.findById(_id).session(session);

      if (!sucursalFound) {
        return notFound({
          message: "No se halló ninguna sucursal con el _id provisto.",
          next,
        });
      }

      const newFields = {
        nombre: nombre || sucursalFound.nombre,
        ciudad: ciudad || sucursalFound.ciudad,
        calle: calle || sucursalFound.calle,
        numero: numero || sucursalFound.numero,
        codigo_postal: codigo_postal || sucursalFound.codigo_postal,
      };

      await Sucursal.updateOne(sucursalFound, newFields, {
        session,
      });

      await sucursalFound.save();

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "Sucursal actualizada satisfactoriamente.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);

export const deleteSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { _id } = req.params;

      const sucursal: any = await Sucursal.findById(_id).session(session);

      if (!sucursal) {
        return notFound({
          message: "No se encontró ninguna sucursal con el _id provisto.",
          next,
        });
      }

      if (sucursal.cajeros.length > 0)
        return next(
          new ErrorResponse(
            "No puede eliminar la sucursal porque tiene cajeros asociados.",
            400
          )
        );

      await Sucursal.deleteOne({ _id: sucursal._id }, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "!Sucursal eliminada satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
  }
);
