import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import Cola from "../../../shared/models/Cola";
import { Estado } from "../../../shared/utils/estado";

export const processCola = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const peticionesEnCola: any = await Cola.find({});

    const peticiones = [...peticionesEnCola];

    if (peticiones.length === 0) {
      next();
    } else {
      handlePeticiones(peticiones);

      await Cola.deleteMany({});

      const estado = Estado.getInstance();

      if (estado.getArriba()) {
        next();
      } else {
        res.status(204).json();
      }
    }
  }
);

const handlePeticiones = (peticiones: any[]) => {
  for (let peticion of peticiones) {
    const { body, query, reqType, url } = peticion;

    console.log(body);

    switch (reqType) {
      case "POST": {
        axios.post(url, { cuerpo: body.cuerpo }, { params: { ...query } });
        break;
      }
      case "PUT": {
        axios.put(url, body.cuerpo, { params: { ...query } });
        break;
      }
      case "DELETE": {
        axios.delete(url);
        break;
      }
      default: {
        console.log("Petición inválida");
      }
    }
  }
};
