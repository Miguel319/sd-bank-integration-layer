import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";

export const getClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const CORE_API_URL = String(process.env.CORE_API_URL);

    const { data } = await axios.get(`${CORE_API_URL}/clientes`);

    res.status(200).json(data);
  }
);

export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const CORE_API_URL = String(process.env.CORE_API_URL);

    const { data, status } = await axios.get(`${CORE_API_URL}/clientes/${_id}`);
    // const { data } = await axios.get(`${CORE_API_URL}/clientes/${_id}`);

    res.status(status).json(data);
  }
);

export const createCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = await startSession();

    try {
      session.startTransaction();
      const { cedula, nombre, apellido, sexo } = req.body;
      const CORE_API_URL = String(process.env.CORE_API_URL);

      const cliente = {
        cedula,
        nombre,
        apellido,
        sexo,
      };

      const { data } = await axios.post(`${CORE_API_URL}/clientes/`, cliente);

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

export const updateCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { cedula, nombre, apellido, sexo } = req.body;
    const CORE_API_URL = String(process.env.CORE_API_URL);

    const cliente = {
      cedula,
      nombre,
      apellido,
      sexo,
    };

    const { data } = await axios.post(`${CORE_API_URL}/clientes/`, cliente);

    res.status(201).json(data);
  }
);
