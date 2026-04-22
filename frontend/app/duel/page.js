"use client";

import { useState, useEffect } from "react";

const question = {
  question: "What is 5 + 3?",
  options: ["6", "7", "8", "9"],
  answer: "8",
};

export default function DuelPage() {
  const [time, setTime] = useState(10);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [opponentScore, setOpponentScore] = useState(0);

  // TIMER
  useEffect(() => {
    if (time === 0) {
      finishGame();
      return;
    }

    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  // SIMULATE OPPONENT
  useEffect(() => {
    const randomScore = Math.floor(Math.random() * 2);
    setOpponentScore(randomScore);
  }, []);

  const finishGame = () => {
    if (selected === question.answer) {
      if (opponentScore === 0) {
        setResult("You Win 🎉");
      } else {
        setResult("Draw 🤝");
      }
    } else {
      setResult("You Lose 😢");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <p className="text-green-700 font-semibold">You</p>
        <p className="text-red-500 font-bold">⏳ {time}s</p>
        <p className="text-blue-700 font-semibold">Opponent</p>
      </div>

      {/* QUESTION */}
      <h2 className="text-xl font-bold mb-6 text-center">
        {question.question}
      </h2>

      {/* OPTIONS */}
      <div className="space-y-3">
        {question.options.map((opt, index) => (
          <button
            key={index}
            onClick={() => setSelected(opt)}
            className={`w-full p-4 border rounded-xl text-left
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

      {/* RESULT */}
      {time === 0 && (
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-green-700">
            {result}
          </h3>
          <p className="text-gray-500 mt-2">
            Opponent Score: {opponentScore}
          </p>
        </div>
      )}

    </div>
  );
}