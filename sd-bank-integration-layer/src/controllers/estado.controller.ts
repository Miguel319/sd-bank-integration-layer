import { Request, Response, NextFunction } from "express";
import Cola from "../shared/models/Cola";
import { Estado } from "../shared/utils/estado";
import axios from "axios";
import { asyncHandler } from "../shared/middlewares/async.middleware";

export const getEstado = (req: Request, res: Response, next: NextFunction) => {
  const estado: Estado = Estado.getInstance();

  res.status(200).json(estado.getArriba());
};

export const getEstadoTeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const estado: Estado = Estado.getInstance();

  res.status(200).json(estado.getTellerArriba());
};

export const getEstadoInternetBanking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const estado: Estado = Estado.getInstance();

  res.status(200).json(estado.getIbArriba());
};

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

export const desconectarSistema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const estado: Estado = Estado.getInstance();

  estado.setArriba(false);

  res.status(200).json({
    exito: true,
    mensaje: "¡Se ha desconectado del sistema central!",
    arriba: estado.getArriba(),
  });
};

export const desconectarTeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const estado: Estado = Estado.getInstance();

  estado.setTellerArriba(false);

  res.status(200).json({
    exito: true,
    mensaje: "¡Se ha desconectado del sistema central!",
    arriba: estado.getArriba(),
  });
};

export const desconectarInternetBanking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const estado: Estado = Estado.getInstance();

  estado.setIbArriba(false);

  res.status(200).json({
    exito: true,
    mensaje: "¡Se ha desconectado del sistema central!",
    arriba: estado.getArriba(),
  });
};

export const conectarSistema = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const estado: Estado = Estado.getInstance();

    estado.setArriba(true);

    const peticionesEnCola: any = await Cola.find({});

    const peticiones = [...peticionesEnCola];

    if (peticiones.length === 0) {
      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    } else {
      handlePeticiones(peticiones);

      await Cola.deleteMany({});

      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    }
  }
);

export const conectarTeller = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const estado: Estado = Estado.getInstance();

    estado.setTellerArriba(true);

    const peticionesEnCola: any = await Cola.find({});

    const peticiones = [...peticionesEnCola];

    if (peticiones.length === 0) {
      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    } else {
      handlePeticiones(peticiones);

      await Cola.deleteMany({});

      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    }
  }
);

export const conectarInternetBanking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const estado: Estado = Estado.getInstance();

    estado.setIbArriba(true);

    const peticionesEnCola: any = await Cola.find({});

    const peticiones = [...peticionesEnCola];

    if (peticiones.length === 0) {
      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    } else {
      handlePeticiones(peticiones);

      await Cola.deleteMany({});

      res.status(200).json({
        exito: true,
        mensaje: "¡Se ha reestablecido la comunicación con el sistema central!",
        arriba: estado.getArriba(),
      });
    }
  }
);
