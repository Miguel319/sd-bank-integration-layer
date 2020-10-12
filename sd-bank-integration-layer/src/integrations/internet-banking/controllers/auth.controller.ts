import { getIbApiURL } from "./../../../shared/utils/constants";
import { NextFunction, Response, Request } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import axios from "axios";

export const signup = asyncHandler(
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

    const usuarioACrear = {
      cedula,
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
    };

    const { data, status } = await axios.post(
      `${getIbApiURL()}/auth/signup`,
      usuarioACrear
    );

    res.status(status).json(data);
  }
);

export const signin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { email, contrasenia } = req.body;

    const usuarioACrear = {
      email,
      contrasenia,
    };

    const { data, status } = await axios.post(
      `${getIbApiURL()}/auth/signup`,
      usuarioACrear
    );

    res.status(status).json(data);
  }
);

export const currentUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { data, status } = await axios.get(
      `${getIbApiURL()}/auth/current-user`
    );

    res.status(status).json(data);
  }
);

export const fetchPerfiles = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { data, status } = await axios.get(`${getIbApiURL()}/auth/perfiles`);

    res.status(status).json(data);
  }
);
