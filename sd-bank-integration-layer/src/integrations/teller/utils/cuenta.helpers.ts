import { Request } from "express";
import { Types } from "mongoose";
import TipoDeTransaccion from "../../../shared/models/TipoDeTransaccion";

export const validarReqRetiro = (req: Request): string => {
  const { numero_de_cuenta } = req.params;
  const { monto } = req.body;

  const body: any = {
    monto,
  };

  const errList: Array<string> = [];

  if (!numero_de_cuenta)
    errList.push(
      "Debe proveer el campo 'numero_de_cuenta' en los parámetros de la petición. "
    );

  for (const campo in body) {
    if (!body[campo])
      errList.push(
        `Debe proveer el siguiente campo en el cuerpo: '${campo}'. `
      );
  }

  const errorStringified = errList.join("");

  return errorStringified.slice(0, errorStringified.length - 1) || "";
};

export const validarReqDeposito = (req: Request): string => {
  const { numero_de_cuenta } = req.params;
  const { monto } = req.body;

  const errList: Array<string> = [];

  if (!monto)
    errList.push("Debe proveer el campo 'monto' en el cuerpo de la petición. ");

  if (!numero_de_cuenta)
    errList.push(
      `Debe proveer el siguiente campo en los parámetros: 'numero_de_cuenta'.`
    );

  return errList.join("");
};

export const retirarFondosCuenta = (cuenta: any, monto: number): void => {
  cuenta.balance_actual -= monto;
  cuenta.balance_disponible -= monto;
};

export const checkBalanceRetiro = (
  cuenta: any,
  monto: number,
  montoFormat: string
): string => {
  const excedido = monto - 10 > cuenta.balance_disponible;

  return excedido
    ? `Tiene RD$${cuenta.balance_disponible} disponibles en su cuenta, pero está intentando retirar RD$${montoFormat}. El retiro no puede exceder el balance - RD$10 (impuesto).`
    : "";
};

export const getTransaccionACrear = (
  cuentaEncontrada: any,
  monto: number,
  tipoTrans: any,
  retiro: boolean = false
) => {
  const descripcion = retiro
    ? `Se retiraron RD$${monto.toLocaleString()} de la cuenta.`
    : `Se depositaron RD$${monto.toLocaleString()} en la cuenta.`;

  const transaccionACrear = {
    entidad_asociada: cuentaEncontrada._id,
    cantidad: monto,
    tipo_entidad_asociada: "Cuenta",
    descripcion,
    tipo: tipoTrans._id,
  };

  return transaccionACrear;
};

export const depositarFondos = (cuenta: any, montoADepositar: number): void => {
  cuenta.balance_disponible += montoADepositar;
  cuenta.balance_actual += montoADepositar;
};
