import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const currentUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/auth/current-user`
    );

    res.status(status).json(data);
  }
);

export const signin = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, contrasenia } = req.body;

    const usuario = {
      email,
      contrasenia,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/auth/signin`,
      usuario
    );

    res.status(status).json(data);
  }
);

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

    const usuario = {
      cedula,
      email,
      contrasenia,
      tipo_entidad_asociada,
      perfil,
    };

    const { data, status } = await axios.post(
      `${getCoreAPIURL()}/auth/signup`,
      usuario
    );

    res.status(status).json(data);
  }
);
