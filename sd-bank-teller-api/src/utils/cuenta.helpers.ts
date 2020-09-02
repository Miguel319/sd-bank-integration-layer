import { Request } from "express";

export const validarReqRetiro = (req: Request): string => {
  const { cedula, _id } = req.params;
  const { monto } = req.body;

  const params: any = { cedula, _id };

  const errList: Array<string> = [];

  if (!monto)
    errList.push("Debe proveer el campo 'monto' el cuerpo de la petición.");

  for (const campo in params) {
    if (!params[campo])
      errList.push(
        `Debe proveer el siguiente campo en los parámetros: '${campo}'.`
      );
  }

  return errList.join("");
};

export const retirarFondosCuenta = (cuenta: any, monto: number): void => {
  cuenta.balance_actual -= monto;
  cuenta.balance_disponible -= monto;
};
