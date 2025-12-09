import api from "@/services/api";
import axios from "axios";

export interface DashboardTarget {
  id: number;
  rm_number: string;
  metric_type: "customers" | "aum" | "fbi";
  target_value: number;
  target_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTargetData {
  metric_type: "customers" | "aum" | "fbi";
  target_value: number;
  target_date?: string | null;
  notes?: string | null;
}

export interface UpdateTargetData {
  target_value?: number;
  target_date?: string | null;
  notes?: string | null;
}

export const getTargets = async (): Promise<{ targets: DashboardTarget[] }> => {
  try {
    const response = await api.get("/dashboard-targets");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getTarget = async (
  metric_type: "customers" | "aum" | "fbi"
): Promise<{ target: DashboardTarget | null }> => {
  try {
    const response = await api.get(`/dashboard-targets/${metric_type}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const upsertTarget = async (
  data: CreateTargetData
): Promise<{ target: DashboardTarget }> => {
  try {
    const response = await api.post("/dashboard-targets", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateTarget = async (
  metric_type: "customers" | "aum" | "fbi",
  data: UpdateTargetData
): Promise<{ target: DashboardTarget }> => {
  try {
    const response = await api.put(`/dashboard-targets/${metric_type}`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteTarget = async (
  metric_type: "customers" | "aum" | "fbi"
): Promise<void> => {
  try {
    await api.delete(`/dashboard-targets/${metric_type}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};


