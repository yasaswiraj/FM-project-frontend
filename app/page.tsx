"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchStockData } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStockData();
        console.log("Stock data fetched successfully:", response);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("Failed to fetch stock data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const startAssessment = () => {
    if (!loading && !error) {
      localStorage.clear();
      router.push("/questions/age");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-black mb-6">
        Welcome to Risk Assessment
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Answer a few questions to determine your investment risk tolerance.
      </p>
      {loading ? (
        <p className="text-blue-500 text-lg">Loading stock data...</p>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <button
          onClick={startAssessment}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Start Assessment
        </button>
      )}
    </main>
  );
}
