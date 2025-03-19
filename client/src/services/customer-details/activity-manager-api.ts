import { Activity } from "@/types/page/customer-details";

const BASE_URL = "http://localhost:5000/api/customer-details"; // Replace with your API's base URL

// Helper to process responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "An error occurred while fetching data"
    );
  }
  return response.json();
};

const getActivity = async (bp_number_wm_core: string) => {
  // Include bp_number_wm_core as a query parameter
  const response = await fetch(
    `${BASE_URL}/get-activity?bp_number_wm_core=${bp_number_wm_core}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return handleResponse(response);
};

const postActivity = async (data: Activity) => {
  const response = await fetch(`${BASE_URL}/post-activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export { getActivity, postActivity };
