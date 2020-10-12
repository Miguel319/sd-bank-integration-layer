import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Cliente from "../../../shared/models/Cliente";
import Usuario from "../../../shared/models/Usuario";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { startSession, ClientSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { getClienteToUpdt } from "../../../shared/utils/cliente.helpers";

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

// @desc   GET cliente by céula
// @route  GET /api/v1/clientes/:cedula
// @access Private
export const getClienteCedula = asyncHandler(
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

// @desc   Create cliente
// @route  POST /api/v1/clientes
// @access Private
export const createCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await startSession();
    try {
      session.startTransaction();

      const { cedula, nombre, apellido, sexo, telefono } = req.body;

      const clienteFound = await Cliente.findOne({ cedula }).session(session);

      if (clienteFound)
        return next(
          new ErrorResponse(
            "El campo cédula es único. Ya existe un registro con el valor provisto.",
            400
          )
        );

      const clienteToCreate = { cedula, nombre, apellido, sexo, telefono };

      await Cliente.create([clienteToCreate], { session });

      await session.commitTransaction();

      res.status(201).json({
        exito: true,
        mensaje: "¡Cliente creado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

// @desc   Update cliente
// @route  PUT /api/v1/clientes/:_id
// @access Private
export const updateCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;
      const { cedula, nombre, apellido, sexo, telefono } = req.body;

      const bodyNotEmpty = getClienteToUpdt(req);

      if (!bodyNotEmpty)
        return next(
          new ErrorResponse(
            "Debe proveer al menos un campo para realizar la actualización.",
            400
          )
        );

      const cliente: any = await Cliente.findById(_id);

      if (!cliente)
        return notFound({
          message: "No se halló ningún cliente con el _id provisto.",
          next,
        });

      const clientToUpdt = {
        cedula: cedula || cliente.cedula,
        nombre: nombre || cliente.nombre,
        apellido: apellido || cliente.apellido,
        sexo: sexo || cliente.sexo,
        telefono: telefono || cliente.telefono,
      };

      await Cliente.updateOne(cliente, clientToUpdt, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Cliente actualizado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

// @desc   Delete cliente by ID
// @route  DELETE /api/v1/clientes/:_id
// @access Private
export const deleteCliente = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;

      const cliente: any = await Cliente.findById(_id).session(session);

      if (!cliente) return notFound({ entity: "Cliente", next });

      if (cliente.prestamos.length > 0)
        return next(
          new ErrorResponse(
            "Este cliente tiene préstamos. Debe saldar los préstamos antes de eliminar el cliente.",
            400
          )
        );

      if (cliente.cuentas_bancarias.length > 0) {
        return next(
          new ErrorResponse(
            "Este cliente tiene cuentas asociadas. Debe eliminar las cuentas antes de eliminar el cliente.",
            400
          )
        );
      }

      if (cliente.usuario)
        await Usuario.deleteOne({ _id: cliente.usuario }, { session });

      await Cliente.deleteOne({ _id: cliente._id }, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "!Cliente eliminado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
