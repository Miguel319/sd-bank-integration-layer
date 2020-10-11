import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession, ClientSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";
import { errorHandler } from "../../../../../sd-bank-core-api/src/shared/middlewares/error.middleware";
import Cliente from "../../../shared/models/Cliente";

export const getClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/clientes`);

    res.status(200).json(data);
  }
);

export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/clientes/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session = await startSession();

    try {
      session.startTransaction();
      const { cedula, nombre, apellido, sexo, telefono } = req.body;

      const cliente = {
        cedula,
        nombre,
        apellido,
        sexo,
        telefono,
      };

      const { data, status } = await axios.post(
        `${getCoreAPIURL()}/clientes`,
        cliente
      );

      console.log(data);

      await Cliente.create([{ ...data.meta.cliente }], { session });

      await session.commitTransaction();

      res.status(status).json(data);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const updateCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { _id } = req.params;
      const { cedula, nombre, apellido, sexo } = req.body;

      const cliente = {
        cedula,
        nombre,
        apellido,
        sexo,
      };

      const { data, status } = await axios.put(
        `${getCoreAPIURL()}/clientes/${_id}`,
        cliente
      );

      await Cliente.updateOne(
        { _id: data.meta.cliente._id },
        data.meta.cliente,
        {
          session,
        }
      );

      await session.commitTransaction();

      res.status(status).json(data);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const deleteCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;

      const { data, status } = await axios.delete(
        `${getCoreAPIURL()}/clientes/${_id}`
      );

      await Cliente.deleteOne({ _id }, { session });

      await session.commitTransaction();

      res.status(status).json(data);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
