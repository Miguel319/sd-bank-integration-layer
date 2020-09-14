import { Request } from "express";
import { Types } from "mongoose";

export const validarReqRetiro = (req: Request): string => {
  const { cedula, _id } = req.params;
  const { monto } = req.body;

  const params: any = { cedula, _id };

  const errList: Array<string> = [];

  if (!monto)
    errList.push("Debe proveer el campo 'monto' en el cuerpo de la petición. ");

  for (const campo in params) {
    if (!params[campo])
      errList.push(
        `Debe proveer el siguiente campo en los parámetros: '${campo}'.`
      );
  }

  return errList.join("");
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

export const getTransaccionDeposito = (
  cuentaEncontrada: any,
  monto: number
) => {
  const tipoTrans: any = "5f5e85c4ded5e45e40346f98";

  const transaccionACrear = {
    cuenta: cuentaEncontrada._id,
    cantidad: monto,
    descripcion: `Se depositaron RD$${monto.toLocaleString()} en la cuenta.`,
    tipo: tipoTrans as Types.ObjectId,
  };

  return transaccionACrear;
};

export const depositarFondos = (cuenta: any, montoADepositar: number): void => {
  cuenta.balance_disponible += montoADepositar;
  cuenta.balance_actual += montoADepositar;
};
