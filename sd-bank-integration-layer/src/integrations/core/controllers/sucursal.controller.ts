import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const createSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

    const sucursalACrear = {
      nombre,
      ciudad,
      calle,
      numero,
      codigo_postal,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/sucursales`,
      sucursalACrear
    );

    res.status(status).json(data);
  }
);

export const getCajerosFromSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/sucursales/${_id}/cajeros`
    );

    res.status(status).json(data);
  }
);

export const getAllSucursales = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { data, status } = await axios.get(`${getCoreAPIURL()}/sucursales`);

    res.status(status).json(data);
  }
);

export const getSucursalById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/sucursales/${_id}`
    );

    res.status(status).json(data);
  }
);

export const updateSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

    const sucursalAActualizar = {
      nombre,
      ciudad,
      calle,
      numero,
      codigo_postal,
    };
    const { data, status } = await axios.put(
      `${getCoreAPIURL()}/sucursales/${_id}`,
      sucursalAActualizar
    );

    res.status(status).json(data);
  }
);

export const deleteSucursal = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.delete(
      `${getCoreAPIURL()}/sucursales/${_id}`
    );

    res.status(status).json(data);
  }
);
