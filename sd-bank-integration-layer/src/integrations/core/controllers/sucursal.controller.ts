import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";
import { createSucursal, updateSucursal, deleteSucursal } from '../../../../../sd-bank-core-api/src/apis/core/controllers/sucursal.controller';

export const getSucursales = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { data } = await axios.get(`${getCoreAPIURL()}/sucursales`);

    res.status(200).json(data);
  }
);

export const getSucursalesById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/sucursales/${_id}`
      );
  
      res.status(status).json(data);
    }
  );

  export const createSucursales = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const session = await startSession();
  
      try {
        session.startTransaction();
        const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

      const sucursalACrear = {
        nombre,
        ciudad,
        calle,
        numero,
        codigo_postal,
      };
  
        const { data } = await axios.post(`${getCoreAPIURL()}/surcusales`, sucursalACrear);

  
        res.status(201).json(data);
      } catch (error) {
  
        res.status(400).json(error.response.data);
      } 
    }
  );

  export const updateSucursales = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { data } = await axios.put(`${getCoreAPIURL()}/sucursales/${_id}`);
  
      res.status(201).json(data);
    }
  );

  export const deleteSucursales = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
  
      const { data } = await axios.delete(`${getCoreAPIURL()}/sucursales/${_id}`);
  
      res.status(200).json(data);
    }
  );