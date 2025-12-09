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
  updateActivity,
  deleteActivity,
  getQuarterlyAUM,
  getQuarterlyFUM,
  updateCustomerInfo,
  bulkUpdateCustomers,
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

const deleteActivityController = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  const deletedActivity = await deleteActivity(id);
  res.json(deletedActivity);
};

const updateActivityController = async (req: Request, res: Response) => {
  const activity = req.body as any;
  const updatedActivity = await updateActivity(activity);
  res.json(updatedActivity);
};

const getQuarterlyAUMController = async (req: Request, res: Response) => {
  const { customerID } = req.query as { customerID: string };
  const quarterlyAUM = await getQuarterlyAUM(customerID);
  res.json(quarterlyAUM);
};

const getQuarterlyFUMController = async (req: Request, res: Response) => {
  const { customerID } = req.query as { customerID: string };
  const quarterlyFUM = await getQuarterlyFUM(customerID);
  res.json(quarterlyFUM);
};

const updateCustomerInfoController = async (req: Request, res: Response) => {
  try {
    const { customerID, ...updateData } = req.body;
    if (!customerID) {
      res.status(400).json({ error: "customerID is required" });
      return;
    }
    const updatedCustomer = await updateCustomerInfo(customerID, updateData);
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error in updateCustomerInfoController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const bulkUpdateCustomersController = async (req: Request, res: Response) => {
  try {
    const { customerIDs, ...updateData } = req.body;
    if (!customerIDs || !Array.isArray(customerIDs) || customerIDs.length === 0) {
      res.status(400).json({ error: "customerIDs array is required" });
      return;
    }
    const result = await bulkUpdateCustomers(customerIDs, updateData);
    res.json(result);
  } catch (error: any) {
    console.error("Error in bulkUpdateCustomersController:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: error.message || "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
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
  deleteActivityController,
  updateActivityController,
  getQuarterlyAUMController,
  getQuarterlyFUMController,
  updateCustomerInfoController,
  bulkUpdateCustomersController,
};
