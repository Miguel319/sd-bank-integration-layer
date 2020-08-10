import { Request, Response, NextFunction } from "express";
import Beneficiary from "../models/Beneficiary";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../utils/error-response";
import Account from "../models/Account";
import User from "../models/User";
import { notFound } from "../utils/err-helpers";

type BeneficiaryType = {
  nombre?: string;
  tipo?: String;
  id?: string;
  banco_beneficiario?: string;
  cuenta_beneficiario?: string;
  email?: string;
};

export const createBeneficiary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      nombre,
      tipo,
      id,
      banco_beneficiario,
      cuenta_beneficiario,
      email,
    } = req.body;

    // 1. search for beneficiary if beneficiary_account is from sd-bank -> return name, type, id
    const account = await Account.find({ numero_cuenta: cuenta_beneficiario });

    const beneficiary: BeneficiaryType = {
      nombre,
      tipo,
      id,
      banco_beneficiario,
      cuenta_beneficiario,
      email,
    };

    if (account) {
      const _id = (account as any)._id;
      const user = await User.findById(_id);

      beneficiary.nombre = `${(user as any).nombre} ${(user as any).apellido}`;
      beneficiary.email = (user as any).email;
      beneficiary.banco_beneficiario = "SD Bank";
      beneficiary.cuenta_beneficiario = (account as any).account_number;

      await Beneficiary.create(beneficiary);
      return res
        .status(201)
        .json({
          exito: true,
          mensaje: "¡Beneficiario añadido satisfactoriamente!",
        });
    }

    await Beneficiary.create(beneficiary);
    res
      .status(201)
      .json({
        exito: true,
        mensaje: "¡Beneficiario añadido satisfactoriamente!",
      });
  }
);

export const getBeneficiaries = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const beneficiaries = await Beneficiary.find({});
    res.status(200).json(beneficiaries);
  }
);

export const updateBeneficiary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //filtro like
    //req.query  // google.com/?q=products&type=celular&page=5&color=white
    const { _id } = req.params; // api/abc/products/423523523
    const { nombre, tipo, id, email } = req.body;

    const beneficiary = await Beneficiary.findById(_id);

    if (!beneficiary) return notFound({ entity: "Beneficiario", next });

    const updatedBeneficiary: BeneficiaryType = { nombre, tipo, id, email };

    await Beneficiary.updateOne(beneficiary, updatedBeneficiary);

    res
      .status(200)
      .json({
        exito: true,
        mensaje: "¡Beneficiario actualizado satisfactoriamente!",
      });
  }
);

export const deleteBeneficiary = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const { _id } = req.params;
    await Beneficiary.findOneAndDelete({ _id });

    res
      .status(200)
      .json({
        exito: true,
        mensaje: "¡Beneficiario eliminado satisfactoriamente!",
      });
  }
);

export const getBeneficiaryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.params;
    const beneficiary = await Beneficiary.findOne({ _id });

    if (!beneficiary) notFound({ entity: "Beneficiario", next });

    res.status(200).json(beneficiary);
  }
);
