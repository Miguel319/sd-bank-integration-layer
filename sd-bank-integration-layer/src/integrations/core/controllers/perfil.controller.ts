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

export const getPerfilesById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/perfiles/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createPerfiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { rol, descripcion } = req.body;

      const perfilACrear = {
        rol,
        descripcion,
      };

      const { data } = await axios.post(
        `${getCoreAPIURL}/perfiles`,
        perfilACrear
      );

      res.status(201).json(data);
    } catch (error) {
      res.status(400).json(error.response.data);
    }
  }
);

export const updatePerfil = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { rol, descripcion } = req.body;

    const perfil = {
      rol,
      descripcion,
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
