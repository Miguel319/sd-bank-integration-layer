import { Request } from "express";

export const getCajeroFieldsToUpdt = (req: Request): Object => {
  const { cedula, nombre, apellido, sucursal } = req.body;

  const cajeroToUpdt: any = { cedula, nombre, apellido, sucursal };

  for (const field in cajeroToUpdt) {
    if (!cajeroToUpdt[field]) delete cajeroToUpdt.field;
  }

  return Object.keys(cajeroToUpdt).length === 0 ? undefined : cajeroToUpdt;
};
