import { Request } from "express";

export const getClienteToUpdt = (req: Request) => {
  const { cedula, nombre, apellido, sexo, telefono } = req.body;

  const clientToUpdt: any = { cedula, nombre, apellido, sexo, telefono };

  for (const field in clientToUpdt) {
    if (!clientToUpdt[field]) delete clientToUpdt.field;
  }

  return Object.keys(clientToUpdt).length === 0 ? undefined : clientToUpdt;
};
