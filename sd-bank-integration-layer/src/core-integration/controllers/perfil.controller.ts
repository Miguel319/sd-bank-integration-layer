import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";


export const getPerfiles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data } = await axios.get(`${CORE_API_URL}/perfiles`);
  
      res.status(200).json(data);
    }
  );

  export const getPerfilesById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data, status } = await axios.get(`${CORE_API_URL}/perfiles/${_id}`);
  
      res.status(status).json(data);
    }
  );

  export const createPerfiles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
      try {
        const { rol, descripcion } = req.body;
        const CORE_API_URL = String(process.env.CORE_API_URL);
  
        const perfilACrear = {
          rol,
          descripcion,
        };
  
        const { data } = await axios.post(`${CORE_API_URL}/perfiles/`, perfilACrear);

         
        res.status(201).json(data);

      } catch (error) {
         
        res.status(400).json(error.response.data);
      }
    }
  );