"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import quizAttemptService from "@/services/quizAttemptService";
import quizAttemptSubmitService from "@/services/quizAttemptSubmitService";

export default function QuizPage() {
    const params = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState({});

    const [submitted, setSubmitted] =
        useState(false);

    //const [score, setScore] = useState(0);
    const [score, setScore] = useState(0);

    const [
        savedAnswers,
        setSavedAnswers,
    ] = useState({});

    const [
        alreadyAttempted,
        setAlreadyAttempted,
    ] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, []);

    const loadQuiz = async () => {
        const quizData =
            await quizAttemptService.getQuiz(
                params.quizId
            );

        const questionData =
            await quizAttemptService.getQuestions(
                params.quizId
            );

        setQuiz(quizData);
        setQuestions(questionData);

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        const attempt =
            await quizAttemptSubmitService.checkAttempt(
                user.id,
                params.quizId
            );

        // if (attempt) {
        //     setAlreadyAttempted(true);

        //     setScore(attempt.score);

        //     setSubmitted(true);
        // }

        // if (attempt) {
        //     setAlreadyAttempted(true);

        //     setScore(attempt.score);

        //     setSavedAnswers(
        //         JSON.parse(
        //             attempt.answers
        //         )
        //     );

        //     setSubmitted(true);
        // }

        if (attempt) {
            setAlreadyAttempted(true);

            setScore(attempt);

            setSavedAnswers(
                JSON.parse(
                    attempt.answers
                )
            );

            setSubmitted(true);
        }
    };

    const handleMCQ = (
        questionId,
        option
    ) => {
        const current =
            answers[questionId] || [];

        let updated;

        if (
            current.includes(option)
        ) {
            updated =
                current.filter(
                    (item) =>
                        item !== option
                );
        } else {
            updated = [
                ...current,
                option,
            ];
        }

        setAnswers({
            ...answers,
            [questionId]: updated,
        });
    };

    const handleSubmit = async () => {
        let total = 0;

        questions.forEach((q) => {
            if (q.type === "mcq") {
                const selected =
                    answers[q.id] || [];

                const correct =
                    q.correctAnswers
                        .split(",")
                        .map((x) =>
                            x.trim()
                        );

                let correctSelected = 0;

                selected.forEach((option) => {
                    if (correct.includes(option)) {
                        correctSelected++;
                    }
                });

                const partialMarks =
                    Math.floor(
                        (q.marks /
                            correct.length) *
                        correctSelected
                    );

                total += partialMarks;
            }
        });

        const user =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        const xpEarned = total;

        // await quizAttemptSubmitService.submitAttempt(
        //     {
        //         userId: user.id,

        //         quizId:
        //             Number(
        //                 params.quizId
        //             ),

        //         score: total,

        //         xpEarned,

        //         answers:
        //             JSON.stringify(
        //                 answers
        //             ),
        //     }
        // );



        // setScore(total);
        const result =
            await quizAttemptSubmitService.submitAttempt(
                {
                    userId: user.id,

                    quizId:
                        Number(
                            params.quizId
                        ),

                    score: total,

                    xpEarned,

                    answers:
                        JSON.stringify(
                            answers
                        ),
                }
            );

        if (result.xp) {
            const user =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            user.xp =
                result.xp;

            user.level =
                result.level;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        }
        // setSubmitted(true);

        setScore(total);

        setSavedAnswers(
            answers
        );

        setSubmitted(true);
    };


    const mcqScore =
        typeof score === "object"
            ? score.mcqScore || 0
            : score;

    const shortAnswerScore =
        typeof score === "object"
            ? score.shortAnswerScore || 0
            : 0;

    const totalScore =
        typeof score === "object"
            ? score.score || 0
            : score;

    const reviewCompleted =
        typeof score === "object"
            ? score.reviewed
            : false;

    if (!quiz) {
        return (
            <div className="p-8">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f4ef] p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#eaded4] p-8">

                <h1 className="text-4xl font-bold text-[#6b1f0f] mb-8">
                    {quiz.title}
                </h1>

                {alreadyAttempted && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl">
                        You have already attempted this quiz.
                    </div>
                )}

                {!submitted ? (
                    <>
                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="mb-8 p-6 border rounded-2xl"
                            >
                                <h2 className="text-xl font-semibold mb-4">
                                    Q{index + 1}. {q.question}
                                </h2>

                                {q.type === "mcq" && (
                                    <div className="space-y-3">

                                        <label className="block">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    answers[q.id]?.includes(
                                                        "A"
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    handleMCQ(
                                                        q.id,
                                                        "A"
                                                    )
                                                }
                                            />
                                            {" "}
                                            {q.optionA}
                                        </label>

                                        <label className="block">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    answers[q.id]?.includes(
                                                        "B"
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    handleMCQ(
                                                        q.id,
                                                        "B"
                                                    )
                                                }
                                            />
                                            {" "}
                                            {q.optionB}
                                        </label>

                                        <label className="block">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    answers[q.id]?.includes(
                                                        "C"
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    handleMCQ(
                                                        q.id,
                                                        "C"
                                                    )
                                                }
                                            />
                                            {" "}
                                            {q.optionC}
                                        </label>

                                        <label className="block">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    answers[q.id]?.includes(
                                                        "D"
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    handleMCQ(
                                                        q.id,
                                                        "D"
                                                    )
                                                }
                                            />
                                            {" "}
                                            {q.optionD}
                                        </label>

                                    </div>
                                )}

                                {/* {q.type ===
                                    "short-answer" && (
                                        <textarea
                                            className="w-full border p-3 rounded-xl"
                                            rows={4}
                                            onChange={(e) =>
                                                setAnswers({
                                                    ...answers,
                                                    [q.id]:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    )} */}

                                {q.type === "short" && (
                                    <textarea
                                        className="w-full border p-3 rounded-xl"
                                        rows={4}
                                        placeholder="Write your answer here..."
                                        onChange={(e) =>
                                            setAnswers({
                                                ...answers,
                                                [q.id]: e.target.value,
                                            })
                                        }
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            onClick={handleSubmit}
                            className="bg-[#8b4513] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90"
                        >
                            Submit Quiz
                        </button>
                    </>
                    // ) : (
                    //     <div className="text-center py-10">

                    //         <h2 className="text-4xl font-bold text-green-600 mb-4">
                    //             Quiz Submitted
                    //         </h2>

                    //         <p className="text-2xl">
                    //             Score:
                    //             {" "}
                    //             <span className="font-bold">
                    //                 {score}
                    //             </span>
                    //         </p>

                    //     </div>
                    // )}

                ) : (
                    <div>

                        <h2 className="text-5xl font-bold text-[#6b1f0f] mb-6">
                            Assessment Submitted
                        </h2>


                        {(() => {

                            const shortQuestions =
                                questions.filter(
                                    (q) =>
                                        q.type === "short"
                                );

                            const hasShortQuestions =
                                shortQuestions.length > 0;

                            return (
                                <>






                                    {/* {
                                score === 0 ? (

                                    <div className="mb-8">

                                        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6">

                                            <h3 className="text-2xl font-bold text-amber-700 mb-2">
                                                ⏳ Under Review
                                            </h3>

                                            <p className="text-gray-700">
                                                Your short-answer response has been submitted successfully.
                                            </p>

                                            <p className="text-gray-700 mt-2">
                                                A teacher will review your answer and award XP.
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                <div className="mb-8">

                                    <div className="bg-green-50 border border-green-300 rounded-2xl p-6">

                                        <h3 className="text-2xl font-bold text-green-700 mb-2">
                                            ✅ Review Complete
                                        </h3>

                                        <p className="text-xl">
                                            Score:
                                            <span className="font-bold ml-2">
                                                {score}
                                            </span>
                                        </p>

                                        <p className="text-xl text-[#8b4513] font-semibold mt-3">
                                            XP Earned:
                                            <span className="ml-2">
                                                {score}
                                            </span>
                                        </p>

                                    </div>

                                </div>

                            )
                            } */}

                                    <div className="mb-8">

                                        <div className="bg-green-50 border border-green-300 rounded-2xl p-6 mb-5">

                                            <h3 className="text-2xl font-bold text-green-700 mb-3">
                                                ✅ Auto Evaluation Complete
                                            </h3>

                                            <p className="text-xl">
                                                {/* MCQ Score:
                                                <span className="font-bold ml-2">
                                                    {score}
                                                </span> */}

                                                MCQ Score:
                                                <span className="font-bold ml-2">
                                                    {mcqScore}
                                                </span>
                                            </p>

                                            <p className="text-xl text-[#8b4513] font-semibold mt-3">
                                                XP Earned:
                                                <span className="ml-2">
                                                    {mcqScore}
                                                </span>
                                            </p>

                                        </div>

                                        {hasShortQuestions && !reviewCompleted && (

                                            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6">

                                                <h3 className="text-2xl font-bold text-amber-700 mb-3">
                                                    ⏳ Short Answers Under Review
                                                </h3>

                                                <p className="text-gray-700 mb-4">
                                                    The following questions are waiting for teacher evaluation:
                                                </p>

                                                <div className="space-y-3">

                                                    {shortQuestions.map(
                                                        (q, index) => (

                                                            <div
                                                                key={q.id}
                                                                className="bg-white border rounded-xl p-4"
                                                            >

                                                                <p className="font-semibold text-[#6b1f0f]">
                                                                    Question #{index + 1}
                                                                </p>

                                                                <p className="text-gray-600 mt-1">
                                                                    {q.question}
                                                                </p>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                                <p className="mt-4 text-gray-700">
                                                    Additional XP will be awarded after teacher review.
                                                </p>

                                            </div>

                                        )}

                                        {hasShortQuestions && reviewCompleted && (

                                            <div className="bg-blue-50 border border-blue-300 rounded-2xl p-6">

                                                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                                                    ✅ Short Answer Review Complete
                                                </h3>

                                                <div className="space-y-3">

                                                    <p className="text-xl">
                                                        MCQ XP:
                                                        <span className="font-bold ml-2">
                                                            {mcqScore}
                                                        </span>
                                                    </p>

                                                    <p className="text-xl">
                                                        Short Answer XP:
                                                        <span className="font-bold ml-2">
                                                            {shortAnswerScore}
                                                        </span>
                                                    </p>

                                                    <div className="border-t pt-4">

                                                        <p className="text-3xl font-bold text-[#8b4513]">
                                                            Total XP Earned:
                                                            <span className="ml-3">
                                                                {totalScore}
                                                            </span>
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </>
                            );
                        })()}

                        {/* {questions.map(
                            (q, index) => { */}
                        {
                            questions
                                .filter((q) => q.type === "mcq")
                                .map((q, index) => {
                                    const selected =
                                        savedAnswers[
                                        q.id
                                        ] || [];

                                    const correct =
                                        q.correctAnswers
                                            .split(",");

                                    return (
                                        <div
                                            key={q.id}
                                            className="border rounded-2xl p-5 mb-5"
                                        >
                                            <h3 className="font-bold mb-3">
                                                Q{index + 1}.{" "}
                                                {q.question}
                                            </h3>

                                            <p className="text-sm text-gray-500 mb-4">
                                                Correct Answer: {q.correctAnswers}
                                            </p>

                                            {[
                                                {
                                                    key: "A",
                                                    text: q.optionA,
                                                },
                                                {
                                                    key: "B",
                                                    text: q.optionB,
                                                },
                                                {
                                                    key: "C",
                                                    text: q.optionC,
                                                },
                                                {
                                                    key: "D",
                                                    text: q.optionD,
                                                },
                                            ].map(
                                                (
                                                    option
                                                ) => {
                                                    let bg =
                                                        "";

                                                    if (
                                                        correct.includes(
                                                            option.key
                                                        )
                                                    ) {
                                                        bg =
                                                            "bg-green-100 border-green-500";
                                                    }

                                                    if (
                                                        selected.includes(
                                                            option.key
                                                        ) &&
                                                        !correct.includes(
                                                            option.key
                                                        )
                                                    ) {
                                                        bg =
                                                            "bg-red-100 border-red-500";
                                                    }

                                                    return (
                                                        <div
                                                            key={
                                                                option.key
                                                            }
                                                            className={`border rounded-lg p-2 mb-2 ${bg}`}
                                                        >
                                                            {option.text}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    );
                                }
                                )
                        }

                    </div >
                )}

            </div>
        </div>
    );
}