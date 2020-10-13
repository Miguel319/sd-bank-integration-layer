import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const createCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula, nombre, apellido, sucursal_id } = req.body;

    const cajeroACrear = {
      cedula,
      nombre,
      apellido,
      sucursal_id,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/cajeros`,
      cajeroACrear
    );

    res.status(status).json(data);
  }
);

export const getCajeroById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/cajeros/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getCajeroByCedula = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula } = req.params;
    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/cajeros/por_cedula/${cedula}`
    );

    res.status(status).json(data);
  }
);

export const getUsuarioCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/cajeros/usuario-cajero/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createUsuarioCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const {
      cedula,
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
    } = req.body;

    const usuarioCajeroACrear = {
      cedula,
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/cajeros/auth/signup`,
      usuarioCajeroACrear
    );

    res.status(status).json(data);
  }
);

export const updateCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { cedula, nombre, apellido, sucursal_id } = req.body;

    const cajeroAActualizar = {
      cedula,
      nombre,
      apellido,
      sucursal_id,
    };

    const { data, status } = await axios.put(
      `${getCoreAPIURL()}/cajeros/${_id}`,
      cajeroAActualizar
    );

    res.status(status).json(data);
  }
);

export const deleteCajero = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.delete(
      `${getCoreAPIURL()}/cajeros/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getAllCajeros = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { data, status } = await axios.delete(`${getCoreAPIURL()}/cajeros`);

    res.status(status).json(data);
  }
);
