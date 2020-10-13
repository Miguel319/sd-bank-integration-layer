import { Request } from "express";

export const getAdminToUpdt = (req: Request): boolean => {
  const { cedula, nombre, apellido, sexo } = req.body;

  const adminToUpdt: any = { cedula, nombre, apellido, sexo };

  return Object.values(adminToUpdt).some((field) => Boolean(field));
};
