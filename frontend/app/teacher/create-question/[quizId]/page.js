"use client";

import {
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import questionService
from "@/services/questionService";

export default function CreateQuestion() {

  const params =
    useParams();

  const [question,
    setQuestion] =
    useState("");

  const [type,
    setType] =
    useState("mcq");

  const [optionA,
    setOptionA] =
    useState("");

  const [optionB,
    setOptionB] =
    useState("");

  const [optionC,
    setOptionC] =
    useState("");

  const [optionD,
    setOptionD] =
    useState("");

  const [correctAnswers,
    setCorrectAnswers] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      await questionService
        .createQuestion({
          quizId:
            Number(
              params.quizId
            ),

          question,
          type,

          optionA,
          optionB,
          optionC,
          optionD,

          correctAnswers,
        });

      alert(
        "Question Added"
      );

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswers(
        ""
      );
    };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-[#6b1f0f] mb-8">
          Add Question
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          <textarea
            placeholder="Question"
            className="w-full border rounded-xl p-4"
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
          />

          <select
            className="w-full border rounded-xl p-4"
            value={type}
            onChange={(e) =>
              setType(
                e.target.value
              )
            }
          >
            <option value="mcq">
              Multiple Choice
            </option>

            <option value="short">
              Short Answer
            </option>
          </select>

          {type === "mcq" && (
            <>
              <input
                placeholder="Option A"
                className="w-full border rounded-xl p-4"
                value={optionA}
                onChange={(e) =>
                  setOptionA(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Option B"
                className="w-full border rounded-xl p-4"
                value={optionB}
                onChange={(e) =>
                  setOptionB(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Option C"
                className="w-full border rounded-xl p-4"
                value={optionC}
                onChange={(e) =>
                  setOptionC(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Option D"
                className="w-full border rounded-xl p-4"
                value={optionD}
                onChange={(e) =>
                  setOptionD(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Correct Answers (Example: A,C)"
                className="w-full border rounded-xl p-4"
                value={
                  correctAnswers
                }
                onChange={(e) =>
                  setCorrectAnswers(
                    e.target.value
                  )
                }
              />
            </>
          )}

          <button
            className="w-full bg-[#6f311c] text-white py-4 rounded-xl font-semibold"
          >
            Save Question
          </button>

        </form>

      </div>

    </div>
  );
}