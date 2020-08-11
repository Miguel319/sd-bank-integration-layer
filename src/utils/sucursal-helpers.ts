import { Request } from "express";

export const validateFieldsOnUpdt = (req: Request): string => {
  const { ciudad, calle, numero, codigo_postal } = req.body;

  const fields: any = {
    ciudad,
    calle,
    numero,
    codigo_postal,
  };

  const errorArr: Array<string> = [];

  for (let field in fields) {
    if (!fields[field]) errorArr.push(`El campo '${field}' es mandatorio. `);
  }

  const errorsToStr: string = errorArr.join("");

  // Si hay errores, eliminar el espacio de extra
  return errorsToStr ? errorsToStr.slice(0, errorsToStr.length - 1) : "";
};
