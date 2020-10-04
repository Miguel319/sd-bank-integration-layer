import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Perfil from "../../../shared/models/Perfil";
import Usuario from "../../../shared/models/Usuario";
import {
  sendTokenResponse,
  validateUserCredentials,
} from "../../../shared/utils/auth.helpers";
import { notFound } from "../../../shared/utils/err.helpers";
import ErrorResponse from "../../../shared/utils/error-response";
import { validateRegistration } from "../../../shared/utils/auth.helpers";
import Admin from "../../../shared/models/Admin";
import { Types, ClientSession, startSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import Cliente from "../../../shared/models/Cliente";
import Cajero from "../../../shared/models/Cajero";
import { validateUserCreation } from "../utils/usuario.helpers";

export const getAllUsuarios = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const usuarios = await Usuario.find({});

    res.status(200).json(usuarios);
  }
);

export const getUsuarioById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const usuario = await Usuario.findById(_id);

    if (!usuario)
      return notFound({
        message: "No se halló ningún usuario con el _id provisto.",
        next,
      });

    res.status(200).json(usuario);
  }
);

// @desc   Register user
// @route  POST /api/v1/auth/signup
// @access   Public
export const createUsuario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const {
        email,
        contrasenia,
        tipo_entidad_asociada,
        perfil,
        entidad_asociada,
      } = req.body;

      const invalidFields: string = validateUserCreation(req);

      if (invalidFields) return next(new ErrorResponse(invalidFields, 400));

      // Check if there's already a user with that email
      const userFound = await Usuario.findOne({ email }).session(session);

      if (userFound)
        return next(
          new ErrorResponse(
            "El correo electrónico provisto ya está tomado.",
            400
          )
        );

      const cuentaCreada: any = await Usuario.findOne({ entidad_asociada });

      if (cuentaCreada)
        return next(
          new ErrorResponse(
            `Usted ya posee un usuario de ${tipo_entidad_asociada}.`,
            400
          )
        );

      const entidadUsuario: any =
        tipo_entidad_asociada === "Admin"
          ? await Admin.findById(entidad_asociada)
          : tipo_entidad_asociada === "Cliente"
          ? await Cliente.findById(entidad_asociada)
          : await Cajero.findById(entidad_asociada);

      if (!entidadUsuario)
        return notFound({
          message: `No se halló ningún ${entidad_asociada} asociado al _id provisto.`,
          next,
        });

      const perfilFound = await Perfil.findById(perfil).session(session);

      if (!perfilFound)
        return notFound({ message: "El perfil provisto es inválido.", next });

      const userToCreate = {
        email,
        contrasenia,
        tipo_entidad_asociada,
        entidad_asociada: entidadUsuario._id,
        perfil: perfilFound._id as Types.ObjectId,
      };

      const newUser: any = await Usuario.create([userToCreate], { session });

      entidadUsuario.usuario = newUser[0]._id;
      await entidadUsuario.save();

      await session.commitTransaction();

      sendTokenResponse(newUser[0], 201, res, "sign up", entidadUsuario);
    } catch (error) {
      await session.abortTransaction();

      return errorHandler(error, req, res, next);
    } finally {
      session.endSession();
    }
  }
);

export const getEntidadesAsociadasByPerfil = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const perfil: any = await Perfil.findById(_id);

    if (!perfil)
      return notFound({
        message: "No se halló ningún perfil con el id provisto.",
        next,
      });

    const { tipo_entidad_asociada } = perfil;

    if (!tipo_entidad_asociada)
      return next(
        new ErrorResponse(
          "Debe especificar el tipo de entidad asociada (tipo_entidad_asociada).",
          400
        )
      );

    const entidadesValidas: boolean =
      tipo_entidad_asociada === "Admin" ||
      tipo_entidad_asociada === "Cliente" ||
      tipo_entidad_asociada === "Cajero";

    if (!entidadesValidas)
      return notFound({
        message: "No se halló el tipo de entidad provisto.",
        next,
      });

    if (tipo_entidad_asociada === "Admin") {
      const admins = await Admin.find({ usuario: null });

      return res.status(200).json(admins);
    } else if (tipo_entidad_asociada === "Cliente") {
      const clientes = await Cliente.find({ usuario: null });

      return res.status(200).json(clientes);
    }
    const cajeros = await Cajero.find({ usuario: null });

    return res.status(200).json(cajeros);
  }
);

export const getEntidadByUsuarioId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const usuario: any = await Usuario.findById(_id);

    if (!usuario)
      return notFound({
        message: "No se halló ningún usuario con el _id provisto.",
        next,
      });

    const { entidad_asociada, tipo_entidad_asociada } = usuario;

    if (tipo_entidad_asociada === "Cliente") {
      const cliente = await Cliente.findById(entidad_asociada);

      return res.status(200).json(cliente);
    } else if (tipo_entidad_asociada === "Admin") {
      const admin = await Admin.findById(entidad_asociada);

      return res.status(200).json(admin);
    }

    const cajero = await Cajero.findById(entidad_asociada);

    return res.status(200).json(cajero);
  }
);

export const updateUsuario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();
      const { _id } = req.params;

      const { email, contrasenia } = req.body;

      const usuarioEncontrado: any = await Usuario.findById(_id);

      if (!usuarioEncontrado)
        return notFound({
          message: "No se halló ningún usuario con el _id provisto.",
          next,
        });

      usuarioEncontrado.email = email || usuarioEncontrado.email;
      usuarioEncontrado.contrasenia =
        contrasenia || usuarioEncontrado.contrasenia;

      await usuarioEncontrado.save();
      await session.commitTransaction();

      sendTokenResponse(usuarioEncontrado, 200, res, "update");
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
);

// @desc     Get current logged in user
// @route    GET api/v1/auth/current-user
// @access   Private
export const currentUser = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { _id } = (req as any).user;

    const user = await Usuario.findById(_id);

    res.status(200).json(user);
  }
);

// @desc     Change password
// @route    POST api/v1/auth/forgot-password
// @access   Public
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.params;
    const { contrasenia } = req.body;

    const user: any = await Usuario.findOne({ email });

    if (!user) return notFound({ entity: "Usuario", next });

    const validPassword: boolean = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$.%^&*])[\w!@#$.%^&*]{6,}$/.test(
      contrasenia
    );

    if (!validPassword)
      return next(
        new ErrorResponse(
          "La contraseña debe estar compuesta por letras mayúsculas y minúsculas, así como por números y caracteres especiales.",
          400
        )
      );

    user.password = contrasenia;

    await user.save();

    res.status(200).json({
      exito: true,
      mensaje: "¡Su contraseña ha sido actualizada satisfactoriamente!",
    });
  }
);

// @desc     Forgot password
// @route    POST api/v1/auth/forgot-password
// @access   Public
export const forgotPassword = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    // TODO: SendGrip setup

    const { email } = req.body;
    const user = await Usuario.findOne({ email });

    if (!user) {
      return next(
        new ErrorResponse(
          "No existe ningún usuario con ese correo electrónico.",
          404
        )
      );
    }

    const resetToken = (user as any).getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    console.log(resetToken);

    res.status(200).json(user);
  }
);

// @desc     Delete user
// @route    POST api/v1/auth/
// @access   Private --> Only admins
export const deleteUsuario = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { _id } = req.params;
      const { tipo_entidad_asociada } = req.query;

      const user: any = await Usuario.findById(_id).session(session);

      if (!user) return notFound({ entity: "Usuario", next });

      const { entidad_asociada } = user;

      const entidad: any =
        tipo_entidad_asociada === "Cliente"
          ? await Cliente.findById(entidad_asociada)
          : tipo_entidad_asociada === "Admin"
          ? await Admin.findById(entidad_asociada)
          : await Cajero.findById(entidad_asociada);

      if (!entidad)
        return notFound({
          message: "No se halló ninguna entidad asociada al usuario.",
          next,
        });

      delete entidad.usuario;

      await entidad.save();

      await Usuario.deleteOne(user, { session });

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: "¡Usuario eliminado satisfactoriamente!",
      });
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
);
