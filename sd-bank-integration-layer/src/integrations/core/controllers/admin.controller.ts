import { asyncHandler } from "./../../../shared/middlewares/async.middleware";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { startSession } from "mongoose";
import { getCoreAPIURL } from "../../../shared/utils/constants";


export const getAllAdmins = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { data } = await axios.get(`${getCoreAPIURL()}/admins`);
  
      res.status(200).json(data);
    }
);

export const getAdminById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/admins/${_id}`
      );
  
      res.status(status).json(data);
    }
  );

export const getAdminByCedula = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { cedula } = req.params;
      const { data, status } = await axios.get(
        `${getCoreAPIURL()}/admins/${cedula}`
      );
  
      res.status(status).json(data);
    }
  );

export const createAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      
        const {  cedula, nombre, apellido, sexo  } = req.body;
  
        const admin = {
          cedula,
          nombre,
          apellido,
          sexo
        };
  
        const { data } = await axios.post(`${getCoreAPIURL()}/admins`, admin);
  
        res.status(201).json(data); 
    }
  );

export const updateAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
      const { cedula, nombre, apellido, sexo } = req.body;
  
      const admin = {
        cedula,
        nombre,
        apellido,
        sexo,
      };
  
      const { data, status } = await axios.put(
        `${getCoreAPIURL()}/admins/${_id}`,
        admin
      );
  
      res.status(status).json(data);
    }
  );

export const deleteAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const { _id } = req.params;
  
      const { data, status } = await axios.delete(
        `${getCoreAPIURL()}/admins/${_id}`
      );
  
      res.status(status).json(data);
    }
);