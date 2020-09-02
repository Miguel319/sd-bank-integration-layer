import Cliente from "../models/Cliente";
import Cuenta from "../models/Cuenta";
import { asyncHandler } from "../middlewares/async.middleware";
import { notFound } from "../utils/err.helpers";
import { getCuentaFieldsToUpdt } from "../utils/cuenta.helpers";
import ErrorResponse from "../utils/error-response";
import Transaccion from "../models/Transaccion";

import { Request, Response, NextFunction } from "express";

// @desc   Update cuenta
// @route  GET /api/v1/cuentas
// @access Private
export const getCuentas = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cuentas = await Cuenta.find({});

    res.status(200).json(cuentas);
  }
);

// @desc   GET cuenta by id
// @route  GET /api/v1/cuentas/:_id
// @access Private
export const getCuentaById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;

    const cuenta = await Cuenta.findById(_id);

    if (!cuenta) return notFound({ entity: "Cuenta", next });

    res.status(200).json(cuenta);
  }
);

// @desc   Create cuenta
// @route  POST /api/v1/cuentas
// @access Public
export const createCuenta = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { tipo_de_cuenta, numero_de_cuenta, usuario } = req.body;

    const clienteFound: any = await Cliente.findById(usuario);

    if (!clienteFound) return notFound({ entity: "Cliente", next });

    const cuentaToCreate = {
      tipo_de_cuenta,
      numero_de_cuenta,
      usuario,
    };

    const cuentaCreated: any = await Cuenta.create(cuentaToCreate);

    clienteFound.cuentas.push(cuentaCreated._id);

    await clienteFound.save();

    res.status(201).json({
      exito: true,
      mensaje: "¡Cuenta creada satisfactoriamente!",
    });
  }
);

// @desc   Update cuenta by ID
// @route  PUT /api/v1/cuentas/:_id
// @access Private
export const updateCuenta = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const cuenta = await Cuenta.findById(_id);

    if (!cuenta) return notFound({ entity: "Cuenta", next });

    const fieldsToUpdt: Object = getCuentaFieldsToUpdt(req);

    if (!fieldsToUpdt)
      return next(
        new ErrorResponse("Debe proveer al menos un campo a actualizar.", 400)
      );

    res.status(201).json({
      exito: true,
      mensaje: "¡Cuenta actualizada satisfactoriamente!",
    });
  }
);

// @desc   Delete cuenta by ID
// @route  PUT /api/v1/cuentas/:_id
// @access Private
export const deleteCuenta = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const cuenta = await Cuenta.findById(_id);

    if (!cuenta) return notFound({ entity: "Cuenta", next });

    await Cuenta.deleteOne(cuenta);

    res.status(200).json({
      exito: true,
      mensaje: "¡Cuenta eliminada satisfactoriamente!",
    });
  }
);

// @desc   Display transaction history of a given cuenta
// @route  GET /api/v1/cuentas/:_id/transactions
// @access Private
export const transactionHistory = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const transactions = await Transaccion.find({ cuenta: _id });

    res.status(200).json(transactions);
  }
);
