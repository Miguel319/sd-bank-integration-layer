import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";

export const getPrestamos = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data } = await axios.get(`${CORE_API_URL}/prestamos`);
  
      res.status(200).json(data);
    }
  );

  export const getPrestamoById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data, status } = await axios.get(`${CORE_API_URL}/prestamos/${_id}`);
  
      res.status(status).json(data);
    }
  );

  export const createPrestamo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
      try {
        const { descripcion, cantidad_total, usuario_id } = req.body;
        const CORE_API_URL = String(process.env.CORE_API_URL);
  
        const newPrestamo = {
            descripcion,
            cantidad_total,
            remaining: Number(cantidad_total),
            usuario_id,
          };
  
        const { data } = await axios.post(`${CORE_API_URL}/prestamos/`, newPrestamo);

         
        res.status(201).json(data);

      } catch (error) {
         
        res.status(400).json(error.response.data);
      }
    }
  );

  export const updatePrestamo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { descripcion } = req.params;
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data } = await axios.put(`${CORE_API_URL}/prestamos/`, _id);
  
    res.status(200).json(data);
     
    }
  );