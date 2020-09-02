import { getClienteToUpdt } from "./../utils/cliente.helpers";
import Cliente from "../models/Cliente";
import { asyncHandler } from "../middlewares/async.middleware";
import { notFound } from "../utils/err.helpers";
import ErrorResponse from "../utils/error-response";

import { Request, Response, NextFunction } from "express";

// @desc   GET all clientes
// @route  GET /api/v1/clientes
// @access Private
export const getAllClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const clientes = await Cliente.find({});

    res.status(200).json(clientes);
  }
);

// @desc   GET cliente by ID
// @route  GET /api/v1/clientes/:_id
// @access Private
export const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const cliente = await Cliente.findById(_id);

    if (!cliente) return notFound({ entity: "Cliente", next });

    res.status(200).json(cliente);
  }
);

// @desc   Create cliente
// @route  POST /api/v1/clientes
// @access Private
export const createCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cedula, nombre, apellido, sexo } = req.body;

    const clienteToCreate = { cedula, nombre, apellido, sexo };

    await Cliente.create(clienteToCreate);

    res.status(201).json({
      exito: true,
      mensaje: "¡Cliente creado satisfactoriamente!",
    });
  }
);

// @desc   Update cliente
// @route  PUT /api/v1/clientes/:_id
// @access Private
export const updateCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const clienteToUpdt = getClienteToUpdt(req);

    if (!clienteToUpdt)
      return next(
        new ErrorResponse(
          "Debe proveer al menos un campo para realizar la actualización.",
          400
        )
      );

    await Cliente.updateOne({ _id }, clienteToUpdt);

    res.status(200).json({
      exito: true,
      mensaje: "¡Cliente actualizado satisfactoriamente!",
    });
  }
);

// @desc   Delete cliente by ID
// @route  DELETE /api/v1/clientes/:_id
// @access Private
export const deleteCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const cliente: any = await Cliente.findById(_id);

    if (!cliente) return notFound({ entity: "Cliente", next });

    await Cliente.deleteOne(cliente);

    res.status(200).json({
      exito: true,
      mensaje: "!Cliente eliminado satisfactoriamente!",
    });
  }
);
