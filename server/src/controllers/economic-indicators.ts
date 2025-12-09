import { Request, Response } from "express";
import { getAllEconomicIndicators } from "../models/economic-indicators";

/**
 * Get all economic indicators (GDP Growth, BI Rate, Inflation Rate)
 */
export async function getEconomicIndicatorsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const indicators = await getAllEconomicIndicators();
    
    res.status(200).json({
      success: true,
      data: indicators,
    });
  } catch (error: any) {
    console.error("Error in getEconomicIndicatorsController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch economic indicators",
      error: error.message,
    });
  }
}

