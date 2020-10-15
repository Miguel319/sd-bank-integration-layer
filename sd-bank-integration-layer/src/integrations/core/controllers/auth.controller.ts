import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";

export const signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
    const { cedula, email, contrasenia, tipo_entidad_asociada,perfil} = req.body;
  
        const signup = {
            cedula,
            email,
            contrasenia, 
            tipo_entidad_asociada,
            perfil
        };
  
        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/auth/signup`,
          signup
        ); 
  
        res.status(status).json(data); 
    }
);

export const signin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
    const { email, contrasenia} = req.body;
  
        const signin = { 
            email,
            contrasenia
        };
  
        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/auth/signin`,
          signin
        ); 
  
        res.status(status).json(data); 
    }
);

export const currentUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { _id } = (req as any).user;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/auth/current-user`, _id
      );
  
      res.status(status).json(data);
    }
  );

  export const changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
        const { email } = req.params;
        const { contrasenia } = req.body; 

        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/auth/forgot-password/${email}`,
          contrasenia
        ); 
  
        res.status(status).json(data); 
    }
);

export const forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
         
        const { email } = req.body; 
        
        const { data, status } = await axios.post(
          `${getCoreAPIURL()}/auth/forgot-password/`,
          email
        ); 
  
        res.status(status).json(data); 
    }
);