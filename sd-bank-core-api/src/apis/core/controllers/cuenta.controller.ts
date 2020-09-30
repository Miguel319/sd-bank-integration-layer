import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Cliente from "../../../shared/models/Cliente";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";

import Cuenta from "../../../shared/models/Cuenta";
import Transaccion from "../../../shared/models/Transaccion";
import { getCuentaFieldsToUpdt } from "../../../shared/utils/cuenta.helpers";
import { ClientSession, startSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";

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
    const { tipo_de_cuenta, numero_de_cuenta, cliente_id } = req.body;

    const clienteFound: any = await Cliente.findById(cliente_id);

    if (!clienteFound) return notFound({ entity: "Cliente", next });

    const cuentaToCreate = {
      tipo_de_cuenta,
      numero_de_cuenta,
      cliente: cliente_id,
    };

    const cuentaCreated: any = await Cuenta.create(cuentaToCreate);

    console.log(clienteFound);

    clienteFound.cuentas_bancarias.push(cuentaCreated._id);

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
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { _id } = req.params;

      const cuenta = await Cuenta.findById(_id);

      if (!cuenta) return notFound({ entity: "Cuenta", next });

      const fieldsToUpdt: Object = getCuentaFieldsToUpdt(req);

      if (!fieldsToUpdt)
        return next(
          new ErrorResponse("Debe proveer al menos un campo a actualizar.", 400)
        );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        exito: true,
        mensaje: "¡Cuenta actualizada satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
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
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { _id } = req.params;

      const cuenta: any = await Cuenta.findById(_id);

      if (!cuenta) return notFound({ entity: "Cuenta", next });

      const cliente: any = await Cliente.findOne({
        cuentas_bancarias: cuenta._id,
      });

      const idxToDeleteFrom = cliente.cuentas_bancarias.indexOf(cuenta._id);

      cliente.cuentas_bancarias.splice(idxToDeleteFrom, 1);

      await cliente.save();

      cuenta.cliente.splice();

      await Cuenta.deleteOne(cuenta);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        exito: true,
        mensaje: "¡Cuenta eliminada satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return errorHandler(error, req, res, next);
    }
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
