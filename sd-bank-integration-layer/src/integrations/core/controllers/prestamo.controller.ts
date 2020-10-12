import { getCoreAPIURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getPrestamos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/prestamos`);

    res.status(200).json(data);
  }
);

export const getPrestamoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const { data, status } = await axios.get(
      `${getCoreAPIURL()}/prestamos/${_id}`
    );

    res.status(status).json(data);
  }
);

export const createPrestamo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { descripcion, cantidad_total, usuario_id } = req.body;

      const newPrestamo = {
        descripcion,
        cantidad_total,
        remaining: Number(cantidad_total),
        usuario_id,
      };

      const { data } = await axios.post(
        `${getCoreAPIURL()}/prestamos/`,
        newPrestamo
      );

      res.status(201).json(data);
    } catch (error) {
      res.status(400).json(error.response.data);
    }
  }
);

export const updatePrestamo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;
    const { descripcion } = req.body;

    const description = {
      descripcion,
    };

    const { data } = await axios.put(
      `${getCoreAPIURL()}/prestamos/${_id}`,
      description
    );

    res.status(200).json(data);
  }
);
