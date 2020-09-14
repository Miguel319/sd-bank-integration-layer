import { Request } from "express";

export const getCuentaFieldsToUpdt = (req: Request): Object => {
  const { tipo_de_cuenta, numero_de_cuenta, usuario } = req.body;

  const accountToUpdt: any = { tipo_de_cuenta, numero_de_cuenta, usuario };

  for (const field in accountToUpdt) {
    if (!accountToUpdt[field]) delete accountToUpdt.field;
  }

  return Object.keys(accountToUpdt).length === 0 ? undefined : accountToUpdt;
};
