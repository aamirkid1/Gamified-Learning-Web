"use client";

import { useState, useEffect } from "react";

const questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: "Delhi",
  },
  {
    question: "2 + 2 = ?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "React is a ____?",
    options: ["Library", "Framework", "Language", "Tool"],
    answer: "Library",
  },
];

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQ];

  // TIMER
  useEffect(() => {
    if (time === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  // NEXT
  const handleNext = () => {
    if (selected === question.answer) {
      setScore(score + 1);
    }

    setSelected("");
    setTime(10);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  // PROGRESS %
  const progress = ((currentQ + 1) / questions.length) * 100;

  // RESULT SCREEN
  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <h1 className="text-3xl font-bold text-green-700">
          Quiz Completed 🎉
        </h1>
        <p className="text-xl">
          Your Score: <span className="font-bold">{score}</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">
          Question {currentQ + 1} / {questions.length}
        </p>
        <p className="text-red-500 font-bold">⏳ {time}s</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
        <div
          className="bg-green-600 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* QUESTION */}
      <h2 className="text-xl font-semibold mb-6">
        {question.question}
      </h2>

      {/* OPTIONS */}
      <div className="space-y-3">
        {question.options.map((opt, index) => (
          <button
            key={index}
            onClick={() => setSelected(opt)}
            className={`w-full p-4 border rounded-xl text-left transition
              ${
                selected === opt
                  ? "bg-green-100 border-green-500"
                  : "hover:bg-gray-100"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={handleNext}
        disabled={!selected}
        className="mt-6 w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
      >
        Next
      </button>

    </div>
  );
}