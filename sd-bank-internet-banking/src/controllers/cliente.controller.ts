import { asyncHandler } from "../middlewares/async.middleware";
import { NextFunction, Request, Response } from "express";
import Cliente from "../models/Cliente";
import { notFound } from "../utils/err.helpers";

export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const cliente = await Cliente.findById(_id);

    if (!cliente)
      return notFound({
        message: "No se encontró ningún cliente con el ID provisto.",
        next,
      });

    res.status(200).json(cliente);
  }
);

export const getClienteByCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cedula } = req.params;

    const cliente = await Cliente.findOne({ cedula });

    if (!cliente)
      return notFound({
        message: "No se encontró ningún cliente con la cédula provista.",
        next,
      });

    res.status(200).json(cliente);
  }
);
