import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getAllTiposDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/tipo-de-transaccion`);

    res.status(200).json(data);
  }
);

export const getTipoDeTransaccionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/tipo-de-transaccion/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tipo } = req.body;

      const tipotransaccion = {
        tipo,
      };

      const { data } = await axios.post(
        `${getCoreAPIURL()}/tipo-de-transaccion/`,
        tipotransaccion
      );

      res.status(201).json(data);
    } catch (error) {
      res.status(400).json(error.response.data);
    }
  }
);

export const updateTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { tipo } = req.body;

    const tipotransaccion = {
      tipo,
    };

    const { data } = await axios.put(
      `${getCoreAPIURL()}/tipo-de-transaccion/${_id}`,
      tipotransaccion
    );

    res.status(201).json(data);
  }
);

export const deleteTipoDeTransaccion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.delete(
      `${getCoreAPIURL()}/tipo-de-transaccion/${_id}`
    );

    res.status(status).json(data);
  }
);
