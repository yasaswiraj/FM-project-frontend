"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecommendations } from "@/utils/api";

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const savedRiskLevel = localStorage.getItem("riskLevel") || "High";
      try {
        const data = await getRecommendations(savedRiskLevel, true);
        setRecommendations(data);
        console.log(savedRiskLevel);
      } catch (error) {
        console.error("Error fetching recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const resetRecommendations = () => {
    // Clear stored answers and reset state
    localStorage.clear();
    setRecommendations([]);
    router.push("/"); // Redirect to home
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
              {recommendations.map((stock: any) => (
                <tr key={stock.Ticker}>
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
    </main>
  );
}
