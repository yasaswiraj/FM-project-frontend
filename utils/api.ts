import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch Risk Level
export const getRiskLevel = async (answers: any) => {
  try {
    const response = await apiClient.post("/risk", { answers });
    return response.data;
  } catch (error) {
    console.error("Error fetching risk level:", error);
    throw error;
  }
};

// Fetch Stock Data
export const fetchStockData = async () => {
  try {
    const response = await apiClient.get("/fetch");
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

// Fetch Recommendations
export const getRecommendations = async (riskLevel: string, diversify: boolean) => {
  try {
    const response = await apiClient.post("/recommend", {
      risk_level: riskLevel,
      diversify,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

// Save Portfolio Preference
export const savePortfolioPreference = async (diversify: boolean) => {
  try {
    const response = await apiClient.post("/portfolio-preference", { diversify });
    return response.data;
  } catch (error) {
    console.error("Error saving portfolio preference:", error);
    throw error;
  }
};

// Get Portfolio Preference
export const getPortfolioPreference = async () => {
  try {
    const response = await apiClient.get("/get-preference");
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio preference:", error);
    throw error;
  }
};

// Fetch Chart Data for a Stock
export const fetchStockChartData = async (ticker: string) => {
  try {
    const response = await apiClient.get(`/forecast/${ticker}`);
    return response.data; // This should return a base64 image string
  } catch (error) {
    console.error(`Error fetching chart data for ${ticker}:`, error);
    throw error;
  }
};
