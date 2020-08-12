import { asyncHandler } from "../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import Sucursal from "../models/Sucursal";
import { notFound } from "../utils/err.helpers";
import { validateFieldsOnUpdt } from "../utils/sucursal.helpers";
import ErrorResponse from "../utils/error-response";

export const createSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { ciudad, calle, numero, codigo_postal, codigo } = req.body;

    const newSucursal = { ciudad, calle, numero, codigo_postal, codigo };

    await Sucursal.create(newSucursal);

    res.status(201).json({
      exito: true,
      mensaje: "¡Sucursal agregada exitosamente!",
    });
  }
);

export const getSucursales = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const sucursales = await Sucursal.find({});

    res.status(200).json(sucursales);
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

    if (!sucursal) return notFound({ entity: "Sucursal", next });

    res.status(200).json(sucursal);
  }
);

export const updateSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    const { ciudad, calle, numero, codigo_postal } = req.body;

    const areFieldsInvalid: string = validateFieldsOnUpdt(req);

    if (areFieldsInvalid) return next(new ErrorResponse(areFieldsInvalid, 400));

    const sucursal: any = await Sucursal.findById(_id);

    if (!sucursal)
      return notFound({
        message: "No se encontró ninguna sucursal con el ID provisto.",
        next,
      });

    sucursal.ciudad = ciudad;
    sucursal.calle = calle;
    sucursal.numero = numero;
    sucursal.codigo_postal = codigo_postal;

    await sucursal.save();

    res.status(200).json({
      exito: true,
      mensaje: "¡Sucursal actualizada exitosamente!",
    });
  }
);

export const deleteSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    await Sucursal.deleteOne({ _id });

    res.status(200).json({
      exito: true,
      mensaje: "¡Sucursal eliminada satisfactoriamente!",
    });
  }
);
