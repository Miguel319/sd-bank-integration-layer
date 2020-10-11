import { getTellerApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import axios from "axios";

export const signIn = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, contrasenia } = req.body;

    const usuarioAIniciarSesion = {
      email,
      contrasenia,
    };

    const { status, data } = await axios.post(
      `${getTellerApiURL()}/auth/signin`,
      usuarioAIniciarSesion
    );

    res.status(status).json(data);
  }
);
