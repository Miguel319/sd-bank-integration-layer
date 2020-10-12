import { getIbApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const getAllPrestamosFromClienteId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/prestamos/cliente/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getPrestamoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/prestamos/${_id}`
    );

    res.status(status).json(data);
  }
);

export const payPrestamoByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const { monto, cliente_id } = req.body;

    const body = { monto, cliente_id };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/prestamos/${_id}/pago`,
      body
    );

    res.status(status).json(data);
  }
);
