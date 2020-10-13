import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getAllUsuarios = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { data, status } = await axios.get(`${getCoreAPIURL()}/usuarios`);

    res.status(status).json(data);
  }
);

export const getUsuarioById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/usuarios/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createUsuario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const {
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
      entidad_asociada,
    } = req.body;

    const usuarioACrear = {
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
      entidad_asociada,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/usuarios`,
      usuarioACrear
    );

    res.status(status).json(data);
  }
);

export const getEntidadesAsociadasByPerfil = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/usuarios/perfil/${_id}/entidades_asociadas`
    );

    res.status(status).json(data);
  }
);

export const updateUsuario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { email, contrasenia } = req.body;

    const usuario = {
      email,
      contrasenia,
    };

    const { data, status } = await axios.put(
      `${getCoreAPIURL()}/usuarios/${_id}`,
      usuario
    );

    res.status(status).json(data);
  }
);

export const deleteUsuario = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { tipo_entidad_asociada } = req.query;

    const queryParams = { tipo_entidad_asociada };

    const { data, status } = await axios.delete(
      `${getCoreAPIURL()}/usuarios/${_id}/entidades_asociadas`,
      {
        params: { ...queryParams },
      }
    );

    res.status(status).json(data);
  }
);

export const getEntidadByUsuarioId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/usuarios/${_id}/entidad`
    );

    res.status(status).json(data);
  }
);
