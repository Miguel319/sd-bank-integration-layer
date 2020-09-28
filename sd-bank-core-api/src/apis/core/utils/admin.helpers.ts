import { Request } from "express";

export const getAdminToUpdt = (req: Request) => {
  const { cedula, nombre, apellido, sexo } = req.body;

  const adminToUpdt: any = { cedula, nombre, apellido, sexo };

  for (const field in adminToUpdt) {
    if (!adminToUpdt[field]) delete adminToUpdt.field;
  }

  return Object.keys(adminToUpdt).length === 0 ? undefined : adminToUpdt;
};
