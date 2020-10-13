import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getUsuarios = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/usuarios`);

    res.status(200).json(data);
  }
);

export const getUsuariosById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
  
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/usuarios/${_id}`
      );
  
      res.status(status).json(data);
    }
  );

  export const createUsuarios = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
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
  
        const { data } = await axios.post(
          `${getCoreAPIURL}/usuarios`,
          usuarioACrear
        );
  
        res.status(201).json(data);
      } catch (error) {
        res.status(400).json(error.response.data);
      }
    }
  );
  
  export const updateUsuario = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { email, contrasenia } = req.body;
  
      const usuario = {
        email, contrasenia
      };
  
      const { data } = await axios.put(
        `${getCoreAPIURL()}/usuarios/${_id}`,
        usuario
      );
  
      res.status(201).json(data);
    }
  );

  export const deleteUsuario = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
  
      const { data, status } = await axios.delete(
        `${getCoreAPIURL()}/usuarios/${_id}`
      );
  
      res.status(status).json(data);
    }
  );
  