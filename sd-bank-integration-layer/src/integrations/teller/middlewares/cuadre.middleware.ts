import Cuadre from "../../../shared/models/Cuadre";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { NextFunction, Response, Request } from "express";
import Cajero from "../../../shared/models/Cajero";
import { notFound } from "../../../shared/utils/err.helpers";
import { ClientSession, startSession } from "mongoose";
import { errorHandler } from "../../../shared/middlewares/error.middleware";
import ErrorResponse from "../../../shared/utils/error-response";
import OperacionCajero from "../../../shared/models/OperacionCajero";
import { Estado } from "../../../shared/utils/estado";

const getAllCuadres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const cuadres = await Cuadre.find({});

      res.status(200).json(cuadres);
    }
  }
);

const getCuadreById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const { _id } = req.params;

      const cuadre = await Cuadre.findById(_id);

      res.status(200).json(cuadre);
    }
  }
);

const getOperacionesFromCuadreId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const { _id } = req.params;

      const operaciones = await OperacionCajero.find({ cuadre: _id });

      res.status(200).json(operaciones);
    }
  }
);

const getCuadresFromCajeroId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const { _id } = req.params;

      const cuadresDeCajero = await Cuadre.find({ cajero: _id });

      res.status(200).json(cuadresDeCajero);
    }
  }
);

const createCuadre = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const estado = Estado.getInstance();

    if (estado.getTellerArriba()) {
      next();
    } else {
      const session: ClientSession = await startSession();

      try {
        session.startTransaction();

        const { _id } = req.params;
        const { balance_inicial } = req.body;

        const balanceInicialNum: number = Number(balance_inicial);

        if (!balanceInicialNum || balanceInicialNum < 100000)
          return next(
            new ErrorResponse(
              "El balance inicial debe ser de RD$100,000.00 o más.",
              400
            )
          );

        const cajeroEcontrado: any = await Cajero.findById(_id).session(
          session
        );

        if (!cajeroEcontrado)
          return notFound({
            message: "No se halló ningún cajero con el _id provisto.",
            next,
          });

        const cuadreACrear: any = {
          balance_inicial: balanceInicialNum,
          balance_final: balanceInicialNum,
          cajero: cajeroEcontrado._id,
        };

        const cuadreCreado: any = await Cuadre.create([cuadreACrear], {
          session,
        });

        cajeroEcontrado.cuadres.push(cuadreCreado[0]._id);

        await cajeroEcontrado.save();

        await session.commitTransaction();

        res.status(200).json({
          exito: true,
          mensaje: "¡Cuadre creado satisfactoriamente!",
          cuadre: cuadreCreado[0],
        });
      } catch (error) {
        // await session.abortTransaction();

        return errorHandler(error, req, res, next);
      } finally {
        session.endSession();
      }
    }
  }
);

const cuadreMiddleware = {
  getAllCuadres,
  getCuadreById,
  createCuadre,
  getCuadresFromCajeroId,
  getOperacionesFromCuadreId,
};

export default cuadreMiddleware;
