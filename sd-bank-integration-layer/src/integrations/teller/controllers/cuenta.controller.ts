import { getIbApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const processCuentaRetiro = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { numero_de_cuenta } = req.params;
    const { cajero_id, cuadre_id, cedula } = req.query;
    const { monto } = req.body;

    const params = {
      cajero_id,
      cuadre_id,
      cedula,
    };

    const body = { monto };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${numero_de_cuenta}/retiro`,
      body,
      {
        params: { ...params },
      }
    );

    res.status(status).json(data);
  }
);

export const getCuentasFromClienteCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { cedula } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/cliente/${cedula}`
    );

    res.status(status).json(data);
  }
);

export const processCuentaDeposito = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { numero_de_cuenta } = req.params;
    const { cajero_id, cuadre_id, cedula } = req.query;
    const { monto } = req.body;

    const params = {
      cajero_id,
      cuadre_id,
      cedula,
    };

    const body = { monto };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${numero_de_cuenta}/desposito`,
      body,
      {
        params: { ...params },
      }
    );

    res.status(status).json(data);
  }
);
