import { Request, Response } from "express";
import {
  getTargets,
  getTarget,
  upsertTarget,
  updateTarget,
  deleteTarget,
} from "../models/dashboard-targets";

export const getTargetsController = async (req: Request, res: Response) => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const targets = await getTargets(rm_number);
    res.json({ targets });
  } catch (error) {
    console.error("Error in getTargetsController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTargetController = async (req: Request, res: Response) => {
  try {
    const rm_number = (req as any).user?.rm_number;
    const { metric_type } = req.query;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!metric_type || !["customers", "aum", "fbi"].includes(metric_type as string)) {
      res.status(400).json({ error: "Invalid metric_type" });
      return;
    }
    const target = await getTarget(rm_number, metric_type as "customers" | "aum" | "fbi");
    res.json({ target });
  } catch (error) {
    console.error("Error in getTargetController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const upsertTargetController = async (req: Request, res: Response) => {
  try {
    const rm_number = (req as any).user?.rm_number;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { metric_type, target_value, target_date, notes } = req.body;
    if (!metric_type || !["customers", "aum", "fbi"].includes(metric_type)) {
      res.status(400).json({ error: "Invalid metric_type" });
      return;
    }
    if (target_value === undefined || target_value === null) {
      res.status(400).json({ error: "target_value is required" });
      return;
    }
    const target = await upsertTarget({
      rm_number,
      metric_type,
      target_value: parseFloat(target_value),
      target_date: target_date || null,
      notes: notes || null,
    });
    res.json({ target });
  } catch (error) {
    console.error("Error in upsertTargetController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTargetController = async (req: Request, res: Response) => {
  try {
    const rm_number = (req as any).user?.rm_number;
    const { metric_type } = req.params;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!metric_type || !["customers", "aum", "fbi"].includes(metric_type)) {
      res.status(400).json({ error: "Invalid metric_type" });
      return;
    }
    const { target_value, target_date, notes } = req.body;
    const target = await updateTarget(rm_number, metric_type as "customers" | "aum" | "fbi", {
      target_value: target_value !== undefined ? parseFloat(target_value) : undefined,
      target_date: target_date !== undefined ? target_date : undefined,
      notes: notes !== undefined ? notes : undefined,
    });
    res.json({ target });
  } catch (error) {
    console.error("Error in updateTargetController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTargetController = async (req: Request, res: Response) => {
  try {
    const rm_number = (req as any).user?.rm_number;
    const { metric_type } = req.params;
    if (!rm_number) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!metric_type || !["customers", "aum", "fbi"].includes(metric_type)) {
      res.status(400).json({ error: "Invalid metric_type" });
      return;
    }
    await deleteTarget(rm_number, metric_type as "customers" | "aum" | "fbi");
    res.json({ message: "Target deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTargetController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


