import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession, ClientSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";
import Cuenta from "../../../shared/models/Cuenta";
import Cliente from "../../../shared/models/Cliente";
import { errorHandler } from "../../../shared/middlewares/error.middleware";

export const getCuentas = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/cuentas`);

    res.status(200).json(data);
  }
);

export const getCuentaById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/cuentas/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { tipo_de_cuenta, numero_de_cuenta, cliente_id } = req.body;

      const cuenta = {
        tipo_de_cuenta,
        numero_de_cuenta,
        cliente_id,
      };

      const { data } = await axios.post(`${getCoreAPIURL()}/cuentas`, cuenta);

      const clienteAsociado: any = await Cliente.findById(data.meta.cliente_id);

      const cuentaCreada: any = await Cuenta.create([data.meta.cuenta], {
        session,
      });

      clienteAsociado.cuentas_bancarias.push(cuentaCreada[0]._id);

      await session.commitTransaction();

      res.status(201).json(data);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const updateCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;

      const { data, status } = await axios.put(
        `${getCoreAPIURL()}/cuentas/${_id}`
      );

      await Cuenta.updateOne({ _id }, data.meta.cuenta, {
        session,
      });

      res.status(status).json(data);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const deleteCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data } = await axios.delete(`${getCoreAPIURL()}/cuentas/${_id}`);

    res.status(200).json(data);
  }
);

export const transactionHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data } = await axios.get(`${getCoreAPIURL()}/cuentas/${_id}`);

    res.status(200).json(data);
  }
);
