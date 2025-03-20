import api from "@/services/api";
import axios, { AxiosResponse } from "axios";
import { Activity, ActivityResponse } from "@/types/page/customer-details";

// Helper to process responses
const handleResponse = (response: AxiosResponse) => {
  if (response.status !== 200) {
    throw new Error(
      response.data.message || "An error occurred while fetching data"
    );
  }
  return {
    data: response.data,
    error: null,
    loading: false
  }; // Wrap in ActivityResponse format
};

const getActivity = async (bp_number_wm_core: string): Promise<ActivityResponse> => {
  try {
    const response = await api.get("/customer-details/get-activity", {
      params: { bp_number_wm_core },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

const postActivity = async (data: Activity): Promise<ActivityResponse> => {
  try {
    const response = await api.post("/customer-details/post-activity", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export { getActivity, postActivity };
