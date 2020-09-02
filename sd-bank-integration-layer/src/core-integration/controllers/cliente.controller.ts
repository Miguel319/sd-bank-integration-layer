import axios from "axios";
import { asyncHandler } from "../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";

export const getClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const CORE_API_URL = String(process.env.CORE_API_URL);

    const { data } = await axios.get(`${CORE_API_URL}/clientes`);

    res.status(200).json(data);
  }
);
