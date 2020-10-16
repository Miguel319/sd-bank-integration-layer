import { getIbApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Request, Response } from "express";
import axios from "axios";

export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const { data, status } = await axios.get(`${getIbApiURL()}/clientes/${_id}`);

    res.status(status).json(data);
  }
);

export const getClienteByCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cedula } = req.params;

    const { data, status } = await axios.get(
      `${getIbApiURL()}/clientes/por-cedula/${cedula}`
    );

    res.status(status).json(data);
  }
);
