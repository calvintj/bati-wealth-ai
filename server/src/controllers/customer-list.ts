import { Request, Response } from "express";
import { getCustomerList, getCertainCustomerList } from "../models/customer-mapping";

const getCustomerListController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const customerList = await getCustomerList(rm_number);
  res.json(customerList);
};

const getCertainCustomerListController = async (req: Request, res: Response) => {  
  const { rm_number, propensity, aum } = req.query as { rm_number: string, propensity: string, aum: string };
  const customerList = await getCertainCustomerList(rm_number, propensity, aum);
  res.json(customerList);
};

export { getCustomerListController, getCertainCustomerListController };
