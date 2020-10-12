import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Admin from "../../../shared/models/Admin";
import Usuario from "../../../shared/models/Usuario";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { startSession, ClientSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import { getAdminToUpdt } from "../utils/admin.helpers";

// @desc   GET all admins
// @route  GET /api/v1/admins
// @access Private
export const getAllAdmins = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const admins = await Admin.find({});

    res.status(200).json(admins);
  }
);

// @desc   GET admin by ID
// @route  GET /api/v1/admins/:_id
// @access Private
export const getAdminById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id } = req.params;

    const admin = await Admin.findById(_id);

    if (!admin) return notFound({ entity: "Admin", next });

    res.status(200).json(admin);
  }
);

// @desc   GET admin by céula
// @route  GET /api/v1/admins/:cedula
// @access Private
export const getAdminByCedula = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { cedula } = req.params;

    const admin = await Admin.findOne({ cedula });

    if (!admin)
      return notFound({
        message: "No se encontró ningún admin con la cédula provista.",
        next,
      });

    res.status(200).json(admin);
  }
);

// @desc   Create admin
// @route  POST /api/v1/admins
// @access Private
export const createAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await startSession();
    try {
      session.startTransaction();

      const { cedula, nombre, apellido, sexo } = req.body;

      const adminFound = await Admin.findOne({ cedula }).session(session);

      if (adminFound)
        return next(
          new ErrorResponse(
            "El campo cédula es único. Ya existe un registro con el valor provisto.",
            400
          )
        );

      const adminToCreate = { cedula, nombre, apellido, sexo };

      await Admin.create([adminToCreate], { session });

      await session.commitTransaction();

      res.status(201).json({
        exito: true,
        mensaje: "¡Admin creado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

// @desc   Update admin
// @route  PUT /api/v1/admins/:_id
// @access Private
export const updateAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { _id } = req.params;
      const { cedula, nombre, apellido, sexo } = req.body;

      const areFieldsOk: boolean = getAdminToUpdt(req);

      if (!areFieldsOk)
        return next(
          new ErrorResponse(
            "Debe proveer al menos un campo para realizar la actualización.",
            400
          )
        );

      const adminFound: any = await Admin.findById(_id);

      if (!adminFound)
        return notFound({
          message: "No se halló ningún admin con el _id provisto.",
          next,
        });

      const updatedAdmin = {
        cedula: cedula || adminFound.cedula,
        nombre: nombre || adminFound.cedula,
        apellido: apellido || adminFound.apellido,
        sexo: sexo || adminFound.sexo,
      };

      await Admin.updateOne(adminFound, updatedAdmin, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Admin actualizado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

// @desc   Delete admin by ID
// @route  DELETE /api/v1/admins/:_id
// @access Private
export const deleteAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;

      const admin: any = await Admin.findById(_id).session(session);

      if (!admin) return notFound({ entity: "Admin", next });

      if (admin.usuario)
        await Usuario.deleteOne({ _id: admin.usuario }, { session });

      await Admin.deleteOne({ _id: admin._id }, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "!Admin eliminado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);
