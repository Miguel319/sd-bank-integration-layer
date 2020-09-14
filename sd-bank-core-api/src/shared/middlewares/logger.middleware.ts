import { Response, Request, NextFunction } from "express";
import { logger } from '../utils/logger';

export const loggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const reqCopy = { ...req };
  const { ip, body, method } = reqCopy;

  if (body.contrasenia) delete body.contrasenia;

  const objToSend = {
    body,
    ip,
    tipo: method,
  };

  logger.info(JSON.stringify(objToSend));

  next();
};
