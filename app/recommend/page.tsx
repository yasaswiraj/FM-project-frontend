"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecommendations, fetchStockChartData } from "@/utils/api";

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    expectedReturn: null,
    portfolioStdDev: null,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartData, setChartData] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const savedRiskLevel = localStorage.getItem("riskLevel") || "High";
      let savedPreference = localStorage.getItem("savedPreference") === "true";
      try {
        if (savedRiskLevel === "High" && savedPreference) {
          savedPreference = false;
        }
        const data = await getRecommendations(savedRiskLevel, savedPreference);
        setRecommendations(data.recommendations || []);
        setPortfolioMetrics({
          expectedReturn: data.expected_return,
          portfolioStdDev: data.portfolio_std_dev,
        });
      } catch (error) {
        console.error("Error fetching recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const resetRecommendations = () => {
    localStorage.clear();
    setRecommendations([]);
    router.push("/");
  };

  const fetchChart = async (ticker: string) => {
    setChartLoading(true);
    setSelectedStock(ticker);
    try {
      const response = await fetchStockChartData(ticker);
      setChartData(response.chart); // Assuming API returns base64-encoded chart as `chart` key
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setChartLoading(false);
    }
  };

  const closeChartModal = () => {
    setSelectedStock(null);
    setChartData(null);
  };

  return (
    <main className="text-black p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Stock Recommendations</h1>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length > 0 ? (
        <div>
          <table className="table-auto w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Ticker</th>
                <th className="px-4 py-2">Company Name</th>
                <th className="px-4 py-2">Sector</th>
                <th className="px-4 py-2">CAGR</th>
                <th className="px-4 py-2">Std Deviation</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.slice(0, 5).map((stock: any) => (
                <tr
                  key={stock.Ticker}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => fetchChart(stock.Ticker)}
                >
                  <td className="border px-4 py-2">{stock.Ticker}</td>
                  <td className="border px-4 py-2">{stock["Company Name"]}</td>
                  <td className="border px-4 py-2">{stock.Sector}</td>
                  <td className="border px-4 py-2">
                    {(stock.CAGR * 100).toFixed(2)}%
                  </td>
                  <td className="border px-4 py-2">
                    {(stock["Std Deviation"] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Portfolio Metrics</h2>
            <p>
              <strong>Expected Return:</strong>{" "}
              {portfolioMetrics.expectedReturn
                ? `${(portfolioMetrics.expectedReturn * 100).toFixed(2)}%`
                : "N/A"}
            </p>
            <p>
              <strong>Portfolio Std Deviation:</strong>{" "}
              {portfolioMetrics.portfolioStdDev
                ? `${(portfolioMetrics.portfolioStdDev * 100).toFixed(2)}%`
                : "N/A"}
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={resetRecommendations}
              className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
            >
              Go Home and Reset
            </button>
          </div>
        </div>
      ) : (
        <p>No recommendations available.</p>
      )}
      {/* Modal for Chart */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded p-6 w-3/4 max-w-3xl">
            <h2 className="text-xl font-bold mb-4">
              Forecast for {selectedStock}
            </h2>
            {chartLoading ? (
              <p>Loading chart...</p>
            ) : chartData ? (
              <img
                src={`data:image/png;base64,${chartData}`}
                alt={`Forecast for ${selectedStock}`}
                className="w-full"
              />
            ) : (
              <p>Error loading chart.</p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={closeChartModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
