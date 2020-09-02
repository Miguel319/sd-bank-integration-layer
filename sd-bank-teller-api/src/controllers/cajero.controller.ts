import { asyncHandler } from "../middlewares/async.middleware";
import Cajero from "../models/Cajero";
import Prestamo from "../models/Prestamo";
import { validateCashierCredentials } from "../utils/cajero.helpers";
import { sendTokenResponse } from "../utils/auth.helpers";
import ErrorResponse from "../utils/error-response";
import Cliente from "../models/Cliente";
import { notFound } from "../utils/err.helpers";
import {
  validarMontoPrestamo,
  realizarCalculosPrestamos,
} from "../utils/prestamo.helpers";

import { Request, Response, NextFunction } from "express";
import { startSession, ClientSession } from "mongoose";
import Cuenta from "../models/Cuenta";
import { retirarFondosCuenta } from "../utils/cuenta.helpers";

// @desc     Cashier login
// @route    POST
// @access   public
export const signIn = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, contrasenia } = req.body;

    validateCashierCredentials(req, next);

    const cashier = await Cajero.findOne({ email }).select("+contrasenia");

    const isPasswordRight: boolean = await (cashier as any).matchPassword(
      contrasenia
    );
    if (!isPasswordRight) return validateCashierCredentials(req, next, true);

    sendTokenResponse(cashier, 200, res, "sign in");
  }
);

// @desc     a new cashier
// @route    POST
// @access   public
export const signUp = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const {
        cedula,
        nombre,
        apellido,
        email,
        contrasenia,
        sucursal,
      } = req.body;

      const cashierFound = await Cajero.findOne({ cedula });
      if (cashierFound) {
        return next(
          new ErrorResponse("Ya existe un cajero con esas credenciales.", 400)
        );
      }

      const newCashier = await Cajero.create({
        cedula,
        nombre,
        apellido,
        email,
        contrasenia,
        sucursal,
      });

      await session.commitTransaction();

      sendTokenResponse(newCashier, 201, res, "sign up");
    } catch (err) {
      await session.abortTransaction();

      res.status(400).json({
        exito: false,
        mensaje: "No se pudo crear el cajero.",
        err,
      });
    }
  }
);

// @desc     Cashier processes loan from client
// @route    POST
// @access   private
export const processPrestamoPago = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const { cedula, _id } = req.params;
      const { monto } = req.body;

      // Aquí no se comprueba si la cédula es válida porque ya hay un middleware que lo valida.
      const cliente: any = await Cliente.findOne({ cedula });

      const prestamoPerteneceACliente = Boolean(
        cliente.prestamos.find((prestamoId: any) => prestamoId === _id)
      );

      if (!prestamoPerteneceACliente)
        return notFound({
          message: `No se halló ningún préstamo perteneciente a ${cliente.nombre} ${cliente.apellido} con el id provisto.`,
          next,
        });

      const prestamo: any = await Prestamo.findById(_id);

      if (!prestamo) return notFound({ entity: "Préstamo", next });

      const montoNumber: number = Number(monto);

      if (prestamo.cantidad_saldada === prestamo.cantidad_total) {
        await Prestamo.deleteOne(prestamo);

        const idxToDeletePrestamoFrom = cliente.prestamos.indexOf(_id);

        cliente.prestamos.splice(idxToDeletePrestamoFrom, 1);

        await cliente.save();

        return res.status(200).json({
          exito: true,
          mensaje: "El préstamo fue saldado por completo.",
        });
      }

      const balanceExcedido = validarMontoPrestamo(montoNumber, prestamo);

      if (balanceExcedido) return next(new ErrorResponse(balanceExcedido, 400));

      realizarCalculosPrestamos(montoNumber, prestamo);

      await prestamo.save();

      await session.commitTransaction();

      // TODO: Manejar tipos de transacciones

      res.status(200).json({
        exito: true,
        mensaje: `RD$${montoNumber} fueron abonados al préstamo satisfactoriamente.`,
      });
    } catch (error) {
      await session.abortTransaction();

      res.status(500).json({
        mensaje: "No se pudo realizar la transacción.",
        error,
      });
    }
  }
);

// @desc     Cashier process withdraw from cliente
// @route    PUT
// @access   private
export const processCuentaRetiro = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const session = await startSession();

    try {
      session.startTransaction();

      const { cedula, _id } = req.params;
      const { monto } = req.body;

      // Aquí no se comprueba si la cédula es válida porque ya hay un middleware que lo valida.
      const cliente: any = await Cliente.findOne({ cedula });

      const cuentaEncontrada = await Cuenta.findById(_id);

      if (!cuentaEncontrada)
        return notFound({
          message: "No se halló ninguna cuenta con el id provisto.",
          next,
        });

      const cuentaCliente = cliente.cuentas.find(
        (cuenta: any) => cuenta === _id
      );

      if (!cuentaCliente)
        return notFound({
          message: "La cuenta provista no pertenece al cliente.",
          next,
        });

      const montoNumber: number = Number(monto);

      retirarFondosCuenta(cuentaEncontrada, montoNumber);

      await cuentaEncontrada.save();

      await session.commitTransaction();

      res.status(200).json({
        exito: true,
        mensaje: `¡Se retiraron RD$${montoNumber} satisfactoriamente!`,
      });
    } catch (error) {
      await session.abortTransaction();

      res.status(500).json({
        exito: false,
        mensaje: "No se pudo realizar el retiro. Inténtelo de nuevo.",
        error,
      });
    }
  }
);
