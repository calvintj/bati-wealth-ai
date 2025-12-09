import api from "@/services/api";

export interface EconomicIndicator {
  value: number;
  date: string;
  change?: number;
}

export interface EconomicIndicatorsResponse {
  success: boolean;
  data: {
    gdpGrowth: EconomicIndicator | null;
    biRate: EconomicIndicator | null;
    inflationRate: EconomicIndicator | null;
  };
  message?: string;
}

const fetchEconomicIndicators = async (): Promise<EconomicIndicatorsResponse["data"]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.get<EconomicIndicatorsResponse>(
      "/economic-indicators",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch economic indicators");
    }
  } catch (error: any) {
    console.error("Error fetching economic indicators:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch economic indicators");
  }
};

export default fetchEconomicIndicators;

