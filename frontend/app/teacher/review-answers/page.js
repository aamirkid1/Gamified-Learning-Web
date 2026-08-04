"use client";

import { useEffect, useState } from "react";
import reviewAnswerService from "@/services/reviewAnswerService";

export default function ReviewAnswers() {
    // const [attempts, setAttempts] = useState([]);
    // const [scores, setScores] = useState({});

    const [attempts, setAttempts] =
        useState([]);

    const [scores, setScores] =
        useState({});

    const [questions, setQuestions] =
        useState({});



    useEffect(() => {
        loadData();
    }, []);

    // const loadData = async () => {
    //     const data =
    //         await reviewAnswerService.getPending();

    //     setAttempts(data);
    // };


    const loadData = async () => {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const data =
        await reviewAnswerService.getPending(
            user.id
        );

    setAttempts(data);

    const questionMap = {};

        for (const attempt of data) {
            const answers =
                JSON.parse(
                    attempt.answers || "{}"
                );

            for (const questionId of Object.keys(
                answers
            )) {
                try {
                    const question =
                        await reviewAnswerService.getQuestion(
                            questionId
                        );

                    questionMap[questionId] =
                        question;
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setQuestions(questionMap);
    };



    const submitReview = async (attemptId, shortAnswers) => {

    let totalScore = 0;

    for (const [questionId] of shortAnswers) {
        totalScore += Number(
            scores[`${attemptId}-${questionId}`] || 0
        );
    }

    await reviewAnswerService.review(
        attemptId,
        totalScore
    );

    alert("Review submitted successfully");

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
                                    ([questionId]) =>
                                        questions[
                                            questionId
                                        ]?.type === "short"
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
                                                        {
                                                            questions[
                                                                questionId
                                                            ]?.question
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

                                    <div className="mt-8 space-y-5">

    {shortAnswers.map(
        ([questionId]) => (

            <div
                key={questionId}
                className="flex items-center gap-4"
            >

                <label className="font-semibold w-52">

                    Marks for Question

                </label>

                <input
                    type="number"

                    min={0}

                    max={
                        questions[
                            questionId
                        ]?.marks
                    }

                    placeholder="Marks"

                    className="border rounded-xl px-4 py-3 w-40"

                    onChange={(e) => {

    const value = Number(e.target.value);

    const max =
        questions[questionId]?.marks || 0;

    if (value > max) {
        alert(
            `Maximum marks for this question is ${max}`
        );
        return;
    }

    setScores({
        ...scores,
        [`${attempt.id}-${questionId}`]: value,
    });

}}

                />

                <span className="text-gray-500">

                    / {questions[
                        questionId
                    ]?.marks}

                </span>

            </div>

        )

    )}

    <button

        onClick={() =>
    submitReview(
        attempt.id,
        shortAnswers
    )
}

        className="bg-[#8b4513] text-white px-6 py-3 rounded-xl"

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