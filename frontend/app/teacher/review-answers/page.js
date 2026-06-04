"use client";

import { useEffect, useState } from "react";
import reviewAnswerService from "@/services/reviewAnswerService";

export default function ReviewAnswers() {
    const [attempts, setAttempts] = useState([]);
    const [scores, setScores] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data =
            await reviewAnswerService.getPending();

        setAttempts(data);
    };

    const submitReview = async (id) => {
        const score =
            Number(scores[id] || 0);

        await reviewAnswerService.review(
            id,
            score
        );

        alert(
            "Review submitted successfully"
        );

        loadData();
    };

    return (
        <div className="min-h-screen bg-[#f6f2ee] p-8">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="bg-[#6b1f0f] text-white rounded-3xl p-8 shadow-lg mb-8">

                    <h1 className="text-4xl font-bold">
                        Review Short Answers
                    </h1>

                    <p className="mt-2 text-gray-200">
                        Evaluate student responses,
                        assign XP and update progress.
                    </p>

                </div>

                {attempts.length === 0 ? (

                    <div className="bg-white rounded-2xl p-8 shadow-md text-center">

                        <h2 className="text-2xl font-bold text-[#6b1f0f]">
                            No Pending Reviews
                        </h2>

                        <p className="text-gray-500 mt-2">
                            All short-answer submissions
                            have been reviewed.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-8">

                        {attempts.map((attempt) => {

                            const answers =
                                JSON.parse(
                                    attempt.answers || "{}"
                                );



                            //   const shortAnswers =
                            //     Object.entries(
                            //       answers
                            //     ).filter(
                            //       ([, answer]) =>
                            //         typeof answer ===
                            //           "string" &&
                            //         answer.trim()
                            //           .length > 10
                            //     );

                            const shortAnswers =
                                Object.entries(
                                    answers
                                ).filter(
                                    ([, answer]) =>
                                        typeof answer ===
                                        "string"
                                );

                            if (
                                shortAnswers.length === 0
                            )
                                return null;

                            return (
                                <div
                                    key={attempt.id}
                                    className="bg-white rounded-3xl p-8 shadow-md border border-[#eaded4]"
                                >

                                    <div className="flex justify-between items-center mb-6">

                                        <div>

                                            <h2 className="text-2xl font-bold text-[#6b1f0f]">
                                                Attempt #
                                                {attempt.id}
                                            </h2>

                                            <p className="text-gray-500 mt-1">
                                                Student ID:
                                                {" "}
                                                {attempt.userId}
                                            </p>

                                            <p className="text-gray-500">
                                                Quiz ID:
                                                {" "}
                                                {attempt.quizId}
                                            </p>

                                        </div>

                                        <div className="bg-[#f9f6f3] px-4 py-2 rounded-xl border">

                                            <span className="font-semibold text-[#6b1f0f]">
                                                Pending Review
                                            </span>

                                        </div>

                                    </div>

                                    <div className="space-y-5">

                                        {shortAnswers.map(
                                            (
                                                [
                                                    questionId,
                                                    answer,
                                                ]
                                            ) => (

                                                <div
                                                    key={
                                                        questionId
                                                    }
                                                    className="bg-[#f9f6f3] rounded-2xl p-5 border"
                                                >

                                                    <p className="font-bold text-[#6b1f0f] mb-3">
                                                        Question ID:
                                                        {" "}
                                                        {
                                                            questionId
                                                        }
                                                    </p>

                                                    <p className="text-gray-600 mb-2">
                                                        Student
                                                        Answer
                                                    </p>

                                                    <div className="bg-white rounded-xl p-4 border whitespace-pre-wrap">
                                                        {
                                                            answer
                                                        }
                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-4 items-center">

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Enter Score"
                                            className="border border-[#d8c6b9] rounded-xl px-4 py-3 w-40 focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
                                            onChange={(e) =>
                                                setScores({
                                                    ...scores,
                                                    [attempt.id]:
                                                        e.target
                                                            .value,
                                                })
                                            }
                                        />

                                        <button
                                            onClick={() =>
                                                submitReview(
                                                    attempt.id
                                                )
                                            }
                                            className="bg-[#8b4513] hover:bg-[#6b1f0f] text-white px-6 py-3 rounded-xl font-semibold transition"
                                        >
                                            Submit Review
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}