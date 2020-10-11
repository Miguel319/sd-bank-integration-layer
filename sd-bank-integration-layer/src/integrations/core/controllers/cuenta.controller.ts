import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";

// export const abc = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     const { data } = await axios.get(`${getCoreAPIURL()}/cuentas`);

//     res.status(200).json(data)
//   }
// );

export const getCuentas = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // const { data } = await axios.get(`${getCoreAPIURL()}/cuentas`);
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
    try {
      const { tipo_de_cuenta, numero_de_cuenta, cliente_id } = req.body;

      const cuenta = {
        tipo_de_cuenta,
        numero_de_cuenta,
        cliente_id,
      };

      const { data } = await axios.post(`${getCoreAPIURL()}/cuentas`, cuenta);

      res.status(201).json(data);
    } catch (error) {
      res.status(400).json(error.response.data);
    }
  }
);

export const updateCuenta = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data } = await axios.put(`${getCoreAPIURL()}/cuentas/${_id}`);

    res.status(201).json(data);
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
