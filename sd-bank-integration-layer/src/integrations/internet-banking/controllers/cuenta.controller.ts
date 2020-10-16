import { getIbApiURL } from "./../../../shared/utils/constants";
import { asyncHandler } from "../../../shared/middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const getAccountDetailsById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(`${getIbApiURL()}/cuentas/${_id}`);

    res.status(status).json(data);
  }
);

export const transactionHistory = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/${_id}/transacciones`
    );

    res.status(status).json(data);
  }
);

export const getClienteCuentasByClienteId = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/cliente/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getClienteCuentasByClienteCedula = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { cedula } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/cliente/por-cedula/${cedula}`
    );

    res.status(status).json(data);
  }
);

export const getUserDetailsByAccountNo = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { numero_de_cuenta } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/${numero_de_cuenta}/detalles`
    );

    res.status(status).json(data);
  }
);

export const getCuentaAndClienteByAccountNumber = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id, numero_de_cuenta } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/${numero_de_cuenta}/cuentas/cliente/${_id}/cliente-cuenta`
    );

    res.status(status).json(data);
  }
);

export const getTipoTransaccionById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/transacciones/${_id}/tipo`
    );

    res.status(status).json(data);
  }
);

export const getTransaccionById = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/transacciones/${_id}`
    );

    res.status(status).json(data);
  }
);

export const getBeneficiariosFromCuenta = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/${_id}/beneficiarios`
    );

    res.status(status).json(data);
  }
);

export const getBeneficiariosMismoBanco = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/${_id}/beneficiarios-mismo-banco`
    );

    res.status(status).json(data);
  }
);

export const getInterbankTransferBeneficiarios = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.get(
      `${getIbApiURL()}/cuentas/${_id}/beneficiarios-interbancarios`
    );

    res.status(status).json(data);
  }
);

export const depositFunds = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    const { cantidad } = req.body;

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${_id}/depositar`,
      {
        cantidad,
      }
    );

    res.status(status).json(data);
  }
);

export const transferToMyself = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { numero_de_cuenta } = req.params;

    const {
      cliente_id,
      destinatario_numero_de_cuenta,
      cantidad,
      destinatario_nombre,
      destinatario_cedula,
      destinatario_banco,
      destinatario_tipo_de_cuenta,
      beneficiario_id,
    } = req.body;

    const objATransferir = {
      cliente_id,
      destinatario_numero_de_cuenta,
      cantidad,
      destinatario_nombre,
      destinatario_cedula,
      destinatario_banco,
      destinatario_tipo_de_cuenta,
      beneficiario_id,
    };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${numero_de_cuenta}/transferencia-personal`,
      objATransferir
    );

    res.status(status).json(data);
  }
);

export const sameBankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* cuenta_id */ } = req.params;

    const {
      cliente_id,
      destinatario_numero_de_cuenta,
      cantidad,
      destinatario_nombre,
      destinatario_cedula,
      destinatario_banco,
      destinatario_tipo_de_cuenta,
      agregar_beneficiario,
      beneficiario_id,
    } = req.body;

    const objATransferir = {
      cliente_id,
      destinatario_numero_de_cuenta,
      cantidad,
      destinatario_nombre,
      destinatario_cedula,
      destinatario_banco,
      destinatario_tipo_de_cuenta,
      agregar_beneficiario,
      beneficiario_id,
    };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${_id}/transferencia-mismo-banco`,
      objATransferir
    );

    res.status(status).json(data);
  }
);

export const interbankTransfer = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id /* cuenta_id */ } = req.params;
    const {
      cliente_id,
      destinatario_banco,
      destinatario_cedula,
      destinatario_nombre,
      destinatario_tipo_de_cuenta,
      destinatario_numero_de_cuenta,
      cantidad,
      agregar_beneficiario,
      beneficiario_id,
    } = req.body;

    const objATransferir = {
      cliente_id,
      destinatario_banco,
      destinatario_cedula,
      destinatario_nombre,
      destinatario_tipo_de_cuenta,
      destinatario_numero_de_cuenta,
      cantidad,
      agregar_beneficiario,
      beneficiario_id,
    };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${_id}/transferencia-interbancaria`,
      objATransferir
    );

    res.status(status).json(data);
  }
);

export const agregarBeneficiario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const {
      tipo,
      nombre,
      cedula,
      banco_beneficiario,
      cuenta_beneficiario,
      email,
      tipo_de_cuenta,
    } = req.body;

    const nuevoBeneficiario = {
      tipo,
      nombre,
      cedula,
      banco_beneficiario,
      cuenta_beneficiario,
      email,
      tipo_de_cuenta,
    };

    const { status, data } = await axios.put(
      `${getIbApiURL()}/cuentas/${_id}/transferencia-interbancaria`,
      nuevoBeneficiario
    );

    res.status(status).json(data);
  }
);

export const deleteBeneficiario = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;

    const { status, data } = await axios.delete(
      `${getIbApiURL()}/cuentas/beneficiarios/${_id}`
    );

    res.status(status).json(data);
  }
);
