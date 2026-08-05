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

    const [courseCompleted, setCourseCompleted] =
        useState(false);

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

        if (attempt) {
            setAlreadyAttempted(true);

            setScore(attempt);

            setSavedAnswers(
                JSON.parse(attempt.answers)
            );

            setSubmitted(true);

            if (
                attempt.reviewed &&
                attempt.passed &&
                attempt.courseCompleted
            ) {
                setCourseCompleted(true);
            }
        }

        /*
 * Student refreshes after teacher review.
 * Show popup only if:
 * 1. Teacher has reviewed
 * 2. Student passed
 * 3. Course is completed
 */
        if (
            attempt &&
            attempt.reviewed &&
            attempt.passed &&
            attempt.courseCompleted
        ) {
            setCourseCompleted(true);
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

        /*
 * MCQ-only quizzes
 * Show popup immediately after submission.
 */
        if (
            result.courseCompleted &&
            result.attempt?.passed
        ) {
            setCourseCompleted(true);
        }

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

    const totalMarks =
        typeof score === "object"
            ? score.totalMarks || 0
            : 0;

    const percentage =
        typeof score === "object"
            ? score.percentage || 0
            : 0;

    const passed =
        typeof score === "object"
            ? score.passed
            : false;

    const passingPercentage =
        quiz?.passingPercentage || 40;

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
                <div className="flex items-center gap-3 text-[#6b1f0f] font-semibold">
                    <span className="h-5 w-5 rounded-full border-2 border-[#6b1f0f] border-t-transparent animate-spin" />
                    Loading...
                </div>
            </div>
        );
    }

    const shortQuestions = questions.filter(
        (q) => q.type === "short"
    );

    const hasShortQuestions =
        shortQuestions.length > 0;

    return (
        <div className="min-h-screen bg-[#f8f4ef] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Hero banner - matches the course page gradient theme */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#6b1f0f] via-[#7c2812] to-[#9a4a22] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-5 sm:mb-6 shadow-xl">

                    <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5" />

                    <span className="relative inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        📝 {submitted ? "Quiz Result" : "Quiz"}
                    </span>

                    <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 break-words">
                        {quiz.title}
                    </h1>

                    <p className="relative text-white/70 text-sm sm:text-base mb-6">
                        {questions.length} question{questions.length !== 1 ? "s" : ""}
                        {submitted && reviewCompleted && (
                            <>
                                {" "}· Passing score {passingPercentage}%
                            </>
                        )}
                    </p>

                    {submitted && (
                        <div className="relative flex flex-wrap items-center gap-3">

                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                    ✅
                                </span>
                                <div className="leading-tight">
                                    <p className="text-[10px] uppercase tracking-wide text-white/60">MCQ Score</p>
                                    <p className="text-white font-bold text-sm sm:text-base">{mcqScore}</p>
                                </div>
                            </div>

                            {hasShortQuestions && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                        {reviewCompleted ? "🧾" : "⏳"}
                                    </span>
                                    <div className="leading-tight">
                                        <p className="text-[10px] uppercase tracking-wide text-white/60">Short Answer</p>
                                        <p className="text-white font-bold text-sm sm:text-base">
                                            {reviewCompleted ? shortAnswerScore : "Pending"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {reviewCompleted && (
                                <>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                            🎯
                                        </span>
                                        <div className="leading-tight">
                                            <p className="text-[10px] uppercase tracking-wide text-white/60">Total</p>
                                            <p className="text-white font-bold text-sm sm:text-base">{totalScore} / {totalMarks}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                            📊
                                        </span>
                                        <div className="leading-tight">
                                            <p className="text-[10px] uppercase tracking-wide text-white/60">Percentage</p>
                                            <p className="text-white font-bold text-sm sm:text-base">{percentage.toFixed(2)}%</p>
                                        </div>
                                    </div>

                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm sm:text-base font-bold shadow-lg ${passed
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {passed ? "PASS ✅" : "FAIL ❌"}
                                    </span>
                                </>
                            )}

                        </div>
                    )}

                </div>

                {alreadyAttempted && (
                    <div className="mb-5 sm:mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm sm:text-base">
                        <span className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-amber-100">⚠️</span>
                        You have already attempted this quiz.
                    </div>
                )}

                {/* Main content card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#eaded4] p-4 sm:p-6 md:p-8">

                    {!submitted ? (
                        <>
                            {questions.map((q, index) => (
                                <div
                                    key={q.id}
                                    className="mb-6 sm:mb-8 p-4 sm:p-6 border border-[#eaded4] rounded-2xl hover:border-[#e0c9b8] transition"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-[#fdf1e8] text-[#8b4513] font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-base sm:text-xl font-semibold text-[#3a1f14] break-words">
                                                {q.question}
                                            </h2>
                                            <span className="inline-block mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide bg-[#f3e5da] text-[#8b4513] px-2.5 py-1 rounded-full">
                                                {q.type === "mcq" ? "Multiple Choice" : "Short Answer"}
                                            </span>
                                        </div>
                                    </div>

                                    {q.type === "mcq" && (
                                        <div className="space-y-2.5 sm:pl-11">

                                            {[
                                                { key: "A", text: q.optionA },
                                                { key: "B", text: q.optionB },
                                                { key: "C", text: q.optionC },
                                                { key: "D", text: q.optionD },
                                            ].map((option) => {
                                                const isChecked =
                                                    answers[q.id]?.includes(option.key) || false;

                                                return (
                                                    <label
                                                        key={option.key}
                                                        className={`flex items-start gap-2 cursor-pointer p-3 rounded-xl border transition ${isChecked
                                                            ? "bg-[#fdf3ec] border-[#8b4513]"
                                                            : "bg-white border-[#eaded4] hover:bg-[#faf6f1]"
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="mt-1 h-4 w-4 flex-shrink-0 accent-[#8b4513]"
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                handleMCQ(q.id, option.key)
                                                            }
                                                        />
                                                        <span className="text-sm sm:text-base break-words text-[#3a1f14]">
                                                            {option.text}
                                                        </span>
                                                    </label>
                                                );
                                            })}

                                        </div>
                                    )}

                                    {q.type === "short" && (
                                        <div className="sm:pl-11">
                                            <textarea
                                                className="w-full border border-[#eaded4] p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#8b4513]/40 focus:border-[#8b4513]"
                                                rows={4}
                                                placeholder="Write your answer here..."
                                                onChange={(e) =>
                                                    setAnswers({
                                                        ...answers,
                                                        [q.id]: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto bg-gradient-to-r from-[#6b1f0f] to-[#8b4513] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition"
                            >
                                Submit Quiz
                            </button>
                        </>
                    ) : (
                        <div>

                            {hasShortQuestions && !reviewCompleted && (

                                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-6 mb-6">

                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 text-lg">⏳</span>
                                        <h3 className="text-lg sm:text-2xl font-bold text-amber-700">
                                            Short Answers Under Review
                                        </h3>
                                    </div>

                                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                                        The following questions are waiting for teacher evaluation:
                                    </p>

                                    <div className="space-y-3">

                                        {shortQuestions.map(
                                            (q, index) => (

                                                <div
                                                    key={q.id}
                                                    className="bg-white border border-amber-200 rounded-xl p-4"
                                                >

                                                    <p className="font-semibold text-[#6b1f0f] text-sm sm:text-base">
                                                        Question #{index + 1}
                                                    </p>

                                                    <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                                                        {q.question}
                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                    <p className="mt-4 text-sm sm:text-base text-gray-700">
                                        Additional XP will be awarded after teacher review.
                                    </p>

                                </div>

                            )}

                            {reviewCompleted && !passed && (

                                <div className="mb-6">

                                    <button
                                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:opacity-95 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition"
                                        onClick={() => {

                                            alert(
                                                "Reappear feature will be enabled in the next phase."
                                            );

                                        }}
                                    >
                                        🔁 Reappear Exam
                                    </button>

                                </div>

                            )}

                            <h3 className="text-lg sm:text-xl font-bold text-[#6b1f0f] mb-4">
                                Answer Review
                            </h3>

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
                                                className="border border-[#eaded4] rounded-2xl p-4 sm:p-5 mb-5"
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-lg bg-[#fdf1e8] text-[#8b4513] font-bold text-xs">
                                                        {index + 1}
                                                    </span>
                                                    <h3 className="font-bold text-sm sm:text-base break-words text-[#3a1f14]">
                                                        {q.question}
                                                    </h3>
                                                </div>

                                                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:pl-10">
                                                    Correct Answer: <span className="font-semibold text-green-700">{q.correctAnswers}</span>
                                                </p>

                                                <div className="sm:pl-10 space-y-2">
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
                                                            let cls =
                                                                "bg-white border-[#eaded4]";

                                                            if (
                                                                correct.includes(
                                                                    option.key
                                                                )
                                                            ) {
                                                                cls =
                                                                    "bg-green-50 border-green-400";
                                                            }

                                                            if (
                                                                selected.includes(
                                                                    option.key
                                                                ) &&
                                                                !correct.includes(
                                                                    option.key
                                                                )
                                                            ) {
                                                                cls =
                                                                    "bg-red-50 border-red-400";
                                                            }

                                                            return (
                                                                <div
                                                                    key={
                                                                        option.key
                                                                    }
                                                                    className={`flex items-center gap-2 border rounded-xl p-2.5 text-sm sm:text-base break-words ${cls}`}
                                                                >
                                                                    <span className="font-semibold text-[#8b4513]">{option.key}.</span>
                                                                    <span className="text-[#3a1f14]">{option.text}</span>
                                                                    {correct.includes(option.key) && (
                                                                        <span className="ml-auto text-green-600">✓</span>
                                                                    )}
                                                                    {selected.includes(option.key) && !correct.includes(option.key) && (
                                                                        <span className="ml-auto text-red-600">✕</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    )
                            }

                        </div >
                    )}

                </div>

            </div>
            {courseCompleted && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white rounded-3xl p-10 w-[92%] max-w-2xl shadow-2xl">

                        <div className="text-center">

                            <div className="text-7xl mb-5">
                                🎉
                            </div>

                            <h2 className="text-5xl font-bold text-[#6b1f0f]">
                                Congratulations!
                            </h2>

                            <p className="mt-4 text-xl text-gray-600">
                                Course Completed Successfully
                            </p>

                            <div className="mt-8 bg-[#f7f2ed] rounded-2xl p-6">

                                <div className="grid grid-cols-2 gap-6">

                                    <div>
                                        <p className="text-gray-500">
                                            XP Earned
                                        </p>

                                        <h3 className="text-3xl font-bold text-[#8b4513]">
                                            +{typeof score === "object"
                                                ? score.xpEarned
                                                : score}
                                        </h3>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">
                                            Result
                                        </p>

                                        <h3
                                            className={`text-3xl font-bold ${passed
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {passed ? "PASSED" : "FAILED"}
                                        </h3>
                                    </div>

                                </div>

                            </div>

                            <p className="mt-8 text-gray-500">
                                Your certificate is ready to be generated.
                            </p>

                            <div className="mt-10 flex justify-center gap-5">

                                <button
                                    disabled
                                    className="px-7 py-3 rounded-xl bg-gray-300 text-gray-600"
                                >
                                    View Certificate
                                </button>

                                <button
                                    onClick={() => setCourseCompleted(false)}
                                    className="px-8 py-3 rounded-xl bg-[#8b4513] text-white"
                                >
                                    Continue Learning
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}
