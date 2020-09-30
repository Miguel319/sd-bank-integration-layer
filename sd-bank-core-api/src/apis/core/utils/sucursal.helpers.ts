import { Request } from "express";

export const getSucursalFieldsToUpdt = (req: Request) => {
  const { nombre, ciudad, calle, numero, codigo_postal } = req.body;

  const sucursalToUpdt: any = { nombre, ciudad, calle, numero, codigo_postal };

  for (const field in sucursalToUpdt) {
    if (!sucursalToUpdt[field]) delete sucursalToUpdt.field;
  }

  return Object.keys(sucursalToUpdt).length === 0 ? undefined : sucursalToUpdt;
};
