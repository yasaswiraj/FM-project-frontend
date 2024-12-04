"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getRiskLevel, getPortfolioPreference } from "@/utils/api";

export default function SummaryPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [preference, setPreference] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
    setAnswers(savedAnswers);

    const fetchRiskLevel = async () => {
      try {
        const result = await getRiskLevel(savedAnswers);
        setRiskLevel(result.risk_level);
        localStorage.setItem("riskLevel", result.risk_level);
      } catch (error) {
        console.error("Error calculating risk level.");
      }
    };

    const fetchPreference = async () => {
      try {
        const savedPreference = await getPortfolioPreference();
        setPreference(
          savedPreference
            ? "Sector-Diversified Portfolio"
            : "Highest Past Returns"
        );
        console.log({ savedPreference });
        localStorage.setItem("savedPreference", savedPreference);
      } catch (error) {
        console.error("Error fetching portfolio preference.");
      }
    };

    fetchRiskLevel();
    fetchPreference();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-black mb-6">Summary</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-black">Your Answers:</h2>
        {Object.entries(answers).map(([key, value]) => (
          <p key={key} className="text-gray-700">
            {key}: {value}
          </p>
        ))}
        {riskLevel && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-black">
              Your Risk Level:
            </h2>
            <p className="text-green-500 font-bold">{riskLevel}</p>
          </div>
        )}
        {preference && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-black">
              Your Portfolio Preference:
            </h2>
            <p className="text-blue-500 font-bold">{preference}</p>
          </div>
        )}
        <button
          onClick={() => router.push("/recommend")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          See Recommendations
        </button>
      </div>
    </main>
  );
}
