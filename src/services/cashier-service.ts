import Cashier from "../models/Cashier";

export class CashierService {

   getById = async (id: any): Promise<any> => await Cashier.findOne({ id });

   getByIdWithSelect = async (id: any): Promise<any> => {
      await Cashier.findOne({ id }).select("+password");
   } 

   createCashier = async(req: any): Promise<any> =>{
      const { id, firstName, lastName, email, password, branch } = req.body;
      await Cashier.create({id, firstName, lastName, email, password, branch});
   }

}