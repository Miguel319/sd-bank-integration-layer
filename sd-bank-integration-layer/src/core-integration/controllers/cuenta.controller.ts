import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";

export const getCuentas = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data } = await axios.get(`${CORE_API_URL}/cuentas`);
  
      res.status(200).json(data);
    }
  );

export const getCuentaById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const CORE_API_URL = String(process.env.CORE_API_URL);
  
      const { data, status } = await axios.get(`${CORE_API_URL}/cuentas/${_id}`);
      
      res.status(status).json(data);
    }
);


export const createCuenta = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      
      try { 
        const {tipo_de_cuenta, numero_de_cuenta, cliente_id} = req.body;
        const CORE_API_URL = String(process.env.CORE_API_URL);
  
        const cuenta = {
            tipo_de_cuenta,
            numero_de_cuenta,
            cliente_id
        };
  
        const { data } = await axios.post(`${CORE_API_URL}/cuentas/`, cuenta);
   
        res.status(201).json(data);

      } 
      catch (error)
      {
        res.status(400).json(error.response.data);
      }
    }
  );

  
export const updateCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const { _id } = req.params;
    const CORE_API_URL = String(process.env.CORE_API_URL); 

    const { data } = await axios.put(`${CORE_API_URL}/cuentas/${_id}`);

    res.status(201).json(data);
  }
);

export const deleteCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const { _id } = req.params;
    const CORE_API_URL = String(process.env.CORE_API_URL); 

    const { data } = await axios.delete(`${CORE_API_URL}/cuentas/${_id}`);

    res.status(200).json(data);
  }
);


export const transactionHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => { 
    const { _id } = req.params;
    const CORE_API_URL = String(process.env.CORE_API_URL); 

    const { data } = await axios.get(`${CORE_API_URL}/cuentas/${_id}`);

    res.status(200).json(data);
  }
);
