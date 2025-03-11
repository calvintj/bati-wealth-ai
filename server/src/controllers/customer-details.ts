import { Request, Response } from "express";
import {
  getCustomerIDList,
  getCustomerDetails,
  getRecommendationProduct,
  getCustomerPortfolio,
  getOptimizedPortfolio,
  getReturnPercentage,
  getOwnedProduct,
  getActivity,
  postActivity,
} from "../models/customer-details";

const getCustomerIDListController = async (req: Request, res: Response) => {
  const { rm_number } = req.query as { rm_number: string };
  const customerIDList = await getCustomerIDList(rm_number);
  res.json(customerIDList);
};

const getCustomerDetailsController = async (req: Request, res: Response) => {
  const { rm_number, customerID } = req.query as { rm_number: string, customerID: string };
  const customerDetails = await getCustomerDetails(rm_number, customerID);
  res.json(customerDetails);
};

const getRecommendationProductController = async (req: Request, res: Response) => {
  const { customerID } = req.query as { customerID: string };
  const recommendationProduct = await getRecommendationProduct(customerID);
  res.json(recommendationProduct);
};

const getCustomerPortfolioController = async (req: Request, res: Response) => {
  const { rm_number, customerID } = req.query as { rm_number: string, customerID: string };
  const customerPortfolio = await getCustomerPortfolio(rm_number, customerID);
  res.json(customerPortfolio);
};

const getOptimizedPortfolioController = async (req: Request, res: Response) => {
  const { rm_number, customerID } = req.query as { rm_number: string, customerID: string };
  const optimizedPortfolio = await getOptimizedPortfolio(rm_number, customerID);
  res.json(optimizedPortfolio);
};

const getReturnPercentageController = async (req: Request, res: Response) => {
  const { customerID } = req.query as { customerID: string };
  const returnPercentage = await getReturnPercentage(customerID);
  res.json(returnPercentage);
};

const getOwnedProductController = async (req: Request, res: Response) => {
  const { rm_number, customerID } = req.query as { rm_number: string, customerID: string };
  const ownedProduct = await getOwnedProduct(rm_number, customerID);
  res.json(ownedProduct);
};

const getActivityController = async (req: Request, res: Response) => {
  const { bp_number_wm_core } = req.query as { bp_number_wm_core: string };
  const activity = await getActivity(bp_number_wm_core);
  res.json(activity);
};

const postActivityController = async (req: Request, res: Response) => {
  const activity = req.body as any;
  const newActivity = await postActivity(activity);
  res.json(newActivity);
};

export {
  getCustomerIDListController,
  getCustomerDetailsController,
  getRecommendationProductController,
  getCustomerPortfolioController,
  getOptimizedPortfolioController,
  getReturnPercentageController,
  getOwnedProductController,
  getActivityController,
  postActivityController,
};
