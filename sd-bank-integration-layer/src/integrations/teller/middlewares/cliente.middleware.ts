import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Cliente from "../../../shared/models/Cliente";
import { notFound } from "../../../shared/utils/err.helpers";

// @desc   GET all clientes
// @route  GET /api/v1/clientes
// @access Private
const getAllClientes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const clientes = await Cliente.find({});

    res.status(200).json(clientes);
  }
);

// @desc   GET cliente by ID
// @route  GET /api/v1/clientes/:_id
// @access Private
const getClienteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const cliente = await Cliente.findById(_id);

    if (!cliente) return notFound({ entity: "Cliente", next });

    res.status(200).json(cliente);
  }
);

// @desc   GET cliente by céula
// @route  GET /api/v1/clientes/:cedula
// @access Private
const getClienteByCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

const clienteMiddleware = {
  getAllClientes,
  getClienteById,
  getClienteByCedula,
};

export default clienteMiddleware;
