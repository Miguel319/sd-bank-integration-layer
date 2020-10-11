import { getTellerApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import axios from "axios";

export const getAllCuadres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { status, data } = await axios.get(`${getTellerApiURL()}/cuadres`);

    res.status(status).json(data);
  }
);

export const getCuadreById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getTellerApiURL()}/cuadres/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getOperacionesFromCuadreId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getTellerApiURL()}/cuadres/${_id}/operaciones`
    );

    res.status(status).json(data);
  }
);

export const getCuadresFromCajeroId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getTellerApiURL()}/cuadres/cajero/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createCuadre = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { balance_inicial } = req.body;

    const {
      status,
      data,
    } = await axios.post(`${getTellerApiURL()}/cuadres/${_id}`, {
      balance_inicial,
    });

    res.status(status).json(data);
  }
);
