"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

const QUESTIONS = [
  {
    id: "age",
    label: "What is your age group?",
    options: ["20-40", "41-60", "60+"],
  },
  {
    id: "income",
    label: "What is your annual income?",
    options: ["5000-15000 USD", "15000-50000 USD", "50000+ USD"],
  },
  {
    id: "horizon",
    label: "What is your investment time horizon?",
    options: ["0-1 year", "1-5 years", "5+ years"],
  },
  {
    id: "amount",
    label: "What is your investment amount?",
    options: ["0-10K USD", "10K-50K USD", "50K+ USD"],
  },
];

export default function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap params with `use`
  const router = useRouter();

  const currentQuestion = QUESTIONS.find((q) => q.id === id);

  if (!currentQuestion) {
    router.push("/"); // Redirect to home if no matching question
    return null;
  }

  const handleAnswer = (answer: string) => {
    const savedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
    const updatedAnswers = { ...savedAnswers, [id]: answer };
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));

    const currentIndex = QUESTIONS.findIndex((q) => q.id === id);
    const nextQuestion = QUESTIONS[currentIndex + 1];
    if (nextQuestion) {
      router.push(`/questions/${nextQuestion.id}`);
    } else {
      router.push("/questions/summary");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-6">
        {currentQuestion.label}
      </h1>
      <div className="space-y-4">
        {currentQuestion.options.map((option: string) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>
    </main>
  );
}
