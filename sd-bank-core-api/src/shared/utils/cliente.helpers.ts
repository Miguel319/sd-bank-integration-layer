import { Request } from "express";

export const getClienteToUpdt = (req: Request) => {
  const { cedula, nombre, apellido, sexo } = req.body;

  const clientToUpdt: any = { cedula, nombre, apellido, sexo };

  for (const field in clientToUpdt) {
    if (!clientToUpdt[field]) delete clientToUpdt.field;
  }

  return Object.keys(clientToUpdt).length === 0 ? undefined : clientToUpdt;
};
