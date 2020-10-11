import { getIbApiURL } from "../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const getPretamosByClienteId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.put(
      `${getIbApiURL()}/prestamos/cliente/${_id}`
    );

    res.status(status).json(data);
  }
);

export const processPrestamoPago = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    const { cajero_id, cuadre_id, cedula } = req.query;
    const { monto } = req.body;

    const params = {
      cajero_id,
      cuadre_id,
      cedula,
    };

    const body = { monto };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/prestamos/${_id}/pago`,
      body,
      {
        params: { ...params },
      }
    ); 

    res.status(status).json(data);

  }
);
