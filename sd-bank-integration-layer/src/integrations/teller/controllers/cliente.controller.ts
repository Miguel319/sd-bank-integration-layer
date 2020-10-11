import { getTellerApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import axios from "axios";

export const getAllClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { status, data } = await axios.get(`${getTellerApiURL()}/clientes`);

    res.status(status).json(data);
  }
);

export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getTellerApiURL()}/clientes/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getClienteByCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { cedula } = req.params;

    const { status, data } = await axios.get(
      `${getTellerApiURL()}/clientes/por-cedula/${cedula}`
    );

    res.status(status).json(data);
  }
);
