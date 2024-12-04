"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchStockData } from "@/utils/api"; // Assuming this function is defined in utils/api.ts

export default function Home() {
  const router = useRouter();

  const startAssessment = () => {
    localStorage.clear(); // Clear previous answers
    router.push("/questions/age"); // Start with the first question
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStockData();
        console.log("Stock data fetched successfully:", response);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData(); // Fetch stock data on app load
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-black mb-6">
        Welcome to Risk Assessment
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Answer a few questions to determine your investment risk tolerance.
      </p>
      <button
        onClick={startAssessment}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
      >
        Start Assessment
      </button>
    </main>
  );
}
