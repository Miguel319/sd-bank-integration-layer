import { Request } from "express";

export const validateUserCreation = (req: Request) => {
  const {
    email,
    contrasenia,
    tipo_entidad_asociada,
    perfil,
    entidad_asociada,
  } = req.body;

  const body: any = {
    email,
    contrasenia,
    tipo_entidad_asociada,
    perfil,
    entidad_asociada,
  };

  const errList = [];

  for (let elem in body) {
    if (!body[elem])
      errList.push(
        `Debe proveer el campo '${elem}' en el cuerpo de la petición. `
      );
  }

  const errorsToStr: string = errList.join("");

  return errorsToStr.length > 0
    ? errorsToStr.slice(0, errorsToStr.length - 1)
    : "";
};
