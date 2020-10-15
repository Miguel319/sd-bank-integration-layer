import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";

export const getAllCajeros = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { data } = await axios.get(`${getCoreAPIURL()}/cajeros`);
  
      res.status(200).json(data);
    }
);

export const getCajeroById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/cajeros/${_id}`
      );
  
      res.status(status).json(data);
    }
  );

export const getCajeroByCedula = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { cedula } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/cajeros/${cedula}`
      );
  
      res.status(status).json(data);
    }
  );

export const getUsuarioCajero = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/cajeros/${_id}`
      );
  
      res.status(status).json(data);
    }
  );

export const createCajero = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
    const { cedula, nombre, apellido, sucursal_id} = req.body;
  
        const cajero = {
            cedula,
             nombre,
              apellido, 
              sucursal_id
        };
  
        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/cajeros`,
          cajero
        ); 
  
        res.status(status).json(data); 
    }
  );

export const createUsuarioCajero = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
    const { cedula, email, contrasenia, tipo_entidad_asociada,perfil} = req.body;
  
        const cajero = {
            cedula,
            email,
            contrasenia,
            tipo_entidad_asociada,
            perfil
        };
  
        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/cajeros`,
          cajero
        ); 
  
        res.status(status).json(data); 
    }
);

export const updateCajero = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { cedula, nombre, apellido, sucursal_id } = req.body;
  
      const admin = {
        cedula,
        nombre,
        apellido,
        sucursal_id,
      };
  
      const { data, status } = await axios.put(
        `${getCoreAPIURL()}/cajeros/${_id}`,
        admin
      );
  
      res.status(status).json(data);
    }
  );

export const deleteCajero = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
  
      const { data, status } = await axios.delete(
        `${getCoreAPIURL()}/cajeros/${_id}`
      );
  
      res.status(status).json(data);
    }
);