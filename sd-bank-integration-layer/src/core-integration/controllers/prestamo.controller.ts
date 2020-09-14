import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";

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
      const session = await startSession();
  //  "usuario_id": "5f5557eb18ec400988eb6b0d"
      try {
        session.startTransaction();
        const { descripcion, cantidad_total, usuario_id } = req.body;
        const CORE_API_URL = String(process.env.CORE_API_URL);
  
        const newPrestamo = {
            descripcion,
            cantidad_total,
            remaining: Number(cantidad_total),
            usuario_id,
          };
  
        const { data } = await axios.post(`${CORE_API_URL}/prestamos/`, newPrestamo);


        await session.commitTransaction();
        session.endSession();
  
        res.status(201).json(data);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
  
        res.status(400).json(error.response.data);
      }
    }
  );