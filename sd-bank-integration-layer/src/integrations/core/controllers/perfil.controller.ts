import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getPerfiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/perfiles`);

    res.status(200).json(data);
  }
);

export const getPerfilById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/perfiles/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createPerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { rol, descripcion, tipo_entidad_asociada } = req.body;

    const perfilACrear = {
      rol,
      descripcion,
      tipo_entidad_asociada,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/perfiles`,
      perfilACrear
    );

    res.status(status).json(data);
  }
);

export const updatePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { rol, descripcion, tipo_entidad_asociada } = req.body;

    const perfil = {
      rol,
      descripcion,
      tipo_entidad_asociada,
    };

    const { data } = await axios.put(
      `${getCoreAPIURL()}/perfiles/${_id}`,
      perfil
    );

    res.status(201).json(data);
  }
);

export const deletePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data } = await axios.delete(`${getCoreAPIURL()}/perfiles/${_id}`);

    res.status(201).json(data);
  }
);
