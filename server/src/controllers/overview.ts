import { Request, Response } from "express";
import {
  getTotalCustomer,
  getTotalAUM,
  getTotalFBI,
  getQuarterlyFBI,
  getQuarterlyFUM,
  getTopProducts,
  getCertainCustomerList,
} from "../models/dashboard-overview";

const getTotalCustomerController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const totalCustomer = await getTotalCustomer(rm_number);
  res.json(totalCustomer);
};

const getTotalAUMController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const totalAUM = await getTotalAUM(rm_number);
  res.json(totalAUM);
};

const getTotalFBIController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const totalFBI = await getTotalFBI(rm_number);
  res.json(totalFBI);
};

const getQuarterlyFUMController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const quarterlyFUM = await getQuarterlyFUM(rm_number);
  res.json(quarterlyFUM);
};

const getQuarterlyFBIController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const quarterlyFBI = await getQuarterlyFBI(rm_number);
  res.json(quarterlyFBI);
};

const getTopProductsController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const topProducts = await getTopProducts(rm_number);
  res.json(topProducts);
};

const getCertainCustomerListController = async (req: Request, res: Response) => {
  const { rm_number, customerRisk } = req.query as { rm_number: string, customerRisk: string };
  const certainCustomerList = await getCertainCustomerList(
    rm_number,
    customerRisk
  );
  res.json(certainCustomerList);
};

export {
  getTotalCustomerController,
  getTotalAUMController,
  getTotalFBIController,
  getQuarterlyFBIController,
  getQuarterlyFUMController,
  getTopProductsController,
  getCertainCustomerListController,
};
