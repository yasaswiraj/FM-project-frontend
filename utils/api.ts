import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

// Fetch the risk level
export const getRiskLevel = async (answers: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/risk`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error fetching risk level:", error);
    throw error;
  }
};

// Fetch stock data
export const fetchStockData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

// Fetch stock recommendations
export const getRecommendations = async (riskLevel: string, diversify: boolean) => {
  try {
    const response = await axios.post(`${BASE_URL}/recommend`, {
      risk_level: riskLevel,
      diversify,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

// Save portfolio preference
export const savePortfolioPreference = async (diversify: boolean) => {
  try {
    const response = await axios.post(`${BASE_URL}/portfolio-preference`, { diversify });
    return response.data;
  } catch (error) {
    console.error("Error saving portfolio preference:", error);
    throw error;
  }
};

// Get saved portfolio preference
export const getPortfolioPreference = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-preference`);
    return response.data.preference;
  } catch (error) {
    console.error("Error fetching portfolio preference:", error);
    throw error;
  }
};
