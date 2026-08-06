"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import quizAttemptService from "@/services/quizAttemptService";
import quizAttemptSubmitService from "@/services/quizAttemptSubmitService";

import AnsweredProgressBar from "@/components/quiz/AnsweredProgressBar";
import QuestionCard, { questionItemVariants } from "@/components/quiz/QuestionCard";
import ReviewCard, { reviewItemVariants } from "@/components/quiz/ReviewCard";
import CompletionModal from "@/components/quiz/CompletionModal";
import useCountUp from "@/lib/useCountUp";

const listContainerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08 },
    },
};

export default function QuizPage() {
    const params = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [savedAnswers, setSavedAnswers] = useState({});
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);

    useEffect(() => {
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadQuiz = async () => {
        const quizData = await quizAttemptService.getQuiz(params.quizId);
        const questionData = await quizAttemptService.getQuestions(params.quizId);

        setQuiz(quizData);
        setQuestions(questionData);

        const user = JSON.parse(localStorage.getItem("user"));

        const attempt = await quizAttemptSubmitService.checkAttempt(user.id, params.quizId);

        if (attempt) {
            setAlreadyAttempted(true);
            setScore(attempt);
            setSavedAnswers(JSON.parse(attempt.answers));
            setSubmitted(true);

            if (attempt.reviewed && attempt.passed && attempt.courseCompleted) {
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
        if (attempt && attempt.reviewed && attempt.passed && attempt.courseCompleted) {
            setCourseCompleted(true);
        }
    };

    const handleMCQ = (questionId, option) => {
        const current = answers[questionId] || [];
        let updated;

        if (current.includes(option)) {
            updated = current.filter((item) => item !== option);
        } else {
            updated = [...current, option];
        }

        setAnswers({
            ...answers,
            [questionId]: updated,
        });
    };

    const handleShortAnswer = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        let total = 0;

        questions.forEach((q) => {
            if (q.type === "mcq") {
                const selected = answers[q.id] || [];
                const correct = q.correctAnswers.split(",").map((x) => x.trim());

                let correctSelected = 0;
                selected.forEach((option) => {
                    if (correct.includes(option)) {
                        correctSelected++;
                    }
                });

                const partialMarks = Math.floor((q.marks / correct.length) * correctSelected);
                total += partialMarks;
            }
        });

        const user = JSON.parse(localStorage.getItem("user"));
        const xpEarned = total;

        const result = await quizAttemptSubmitService.submitAttempt({
            userId: user.id,
            quizId: Number(params.quizId),
            score: total,
            xpEarned,
            answers: JSON.stringify(answers),
        });

        /*
         * MCQ-only quizzes
         * Show popup immediately after submission.
         */
        if (result.courseCompleted && result.attempt?.passed) {
            setCourseCompleted(true);
        }

        if (result.xp) {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            updatedUser.xp = result.xp;
            updatedUser.level = result.level;
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setScore(total);
        setSavedAnswers(answers);
        setSubmitted(true);
        setIsSubmitting(false);
    };

    const mcqScore = typeof score === "object" ? score.mcqScore || 0 : score;
    const shortAnswerScore = typeof score === "object" ? score.shortAnswerScore || 0 : 0;
    const totalScore = typeof score === "object" ? score.score || 0 : score;
    const reviewCompleted = typeof score === "object" ? score.reviewed : false;
    const totalMarks = typeof score === "object" ? score.totalMarks || 0 : 0;
    const percentage = typeof score === "object" ? score.percentage || 0 : 0;
    const passed = typeof score === "object" ? score.passed : false;
    const xpEarnedForModal = typeof score === "object" ? score.xpEarned : score;

    const passingPercentage = quiz?.passingPercentage || 40;

    const answeredCount = useMemo(() => {
        return questions.reduce((count, q) => {
            const val = answers[q.id];
            if (q.type === "mcq") return count + (val && val.length > 0 ? 1 : 0);
            return count + (typeof val === "string" && val.trim().length > 0 ? 1 : 0);
        }, 0);
    }, [answers, questions]);

    const animatedMcqScore = useCountUp(submitted ? mcqScore : 0, { duration: 800 });
    const animatedTotalScore = useCountUp(reviewCompleted ? totalScore : 0, { duration: 900 });
    const animatedPercentage = useCountUp(reviewCompleted ? percentage : 0, {
        duration: 900,
        decimals: 2,
    });

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f4ef]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-[#6b1f0f] font-semibold"
                >
                    <span className="h-5 w-5 rounded-full border-2 border-[#6b1f0f] border-t-transparent animate-spin" />
                    Loading...
                </motion.div>
            </div>
        );
    }

    const shortQuestions = questions.filter((q) => q.type === "short");
    const hasShortQuestions = shortQuestions.length > 0;
    const mcqQuestions = questions.filter((q) => q.type === "mcq");

    return (
        <div className="min-h-screen bg-[#f8f4ef] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero banner */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden bg-gradient-to-br from-[#6b1f0f] via-[#7c2812] to-[#9a4a22] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mb-5 sm:mb-6 shadow-xl"
                >
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
                        {submitted && reviewCompleted && <> · Passing score {passingPercentage}%</>}
                    </p>

                    <AnimatePresence>
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="relative flex flex-wrap items-center gap-3"
                            >
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                        ✅
                                    </span>
                                    <div className="leading-tight">
                                        <p className="text-[10px] uppercase tracking-wide text-white/60">
                                            MCQ Score
                                        </p>
                                        <p className="text-white font-bold text-sm sm:text-base tabular-nums">
                                            {animatedMcqScore}
                                        </p>
                                    </div>
                                </div>

                                {hasShortQuestions && (
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                            {reviewCompleted ? "🧾" : "⏳"}
                                        </span>
                                        <div className="leading-tight">
                                            <p className="text-[10px] uppercase tracking-wide text-white/60">
                                                Short Answer
                                            </p>
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
                                                <p className="text-[10px] uppercase tracking-wide text-white/60">
                                                    Total
                                                </p>
                                                <p className="text-white font-bold text-sm sm:text-base tabular-nums">
                                                    {animatedTotalScore} / {totalMarks}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                            <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/15 text-sm">
                                                📊
                                            </span>
                                            <div className="leading-tight">
                                                <p className="text-[10px] uppercase tracking-wide text-white/60">
                                                    Percentage
                                                </p>
                                                <p className="text-white font-bold text-sm sm:text-base tabular-nums">
                                                    {animatedPercentage.toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>

                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 18,
                                                delay: 0.3,
                                            }}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm sm:text-base font-bold shadow-lg ${
                                                passed ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {passed ? "PASS ✅" : "FAIL ❌"}
                                        </motion.span>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {alreadyAttempted && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 sm:mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm sm:text-base"
                    >
                        <span className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-amber-100">
                            ⚠️
                        </span>
                        You have already attempted this quiz.
                    </motion.div>
                )}

                {/* Live "answered" progress bar — only while taking the quiz */}
                {!submitted && (
                    <AnsweredProgressBar answeredCount={answeredCount} totalCount={questions.length} />
                )}

                {/* Main content card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#eaded4] p-4 sm:p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="taking"
                                variants={listContainerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                            >
                                {questions.map((q, index) => (
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        index={index}
                                        answers={answers}
                                        onToggleOption={handleMCQ}
                                        onShortAnswerChange={handleShortAnswer}
                                    />
                                ))}

                                <motion.button
                                    variants={questionItemVariants}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto bg-gradient-to-r from-[#6b1f0f] to-[#8b4513] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && (
                                        <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
                                    )}
                                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {hasShortQuestions && !reviewCompleted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-6 mb-6"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 text-lg">
                                                ⏳
                                            </span>
                                            <h3 className="text-lg sm:text-2xl font-bold text-amber-700">
                                                Short Answers Under Review
                                            </h3>
                                        </div>

                                        <p className="text-sm sm:text-base text-gray-700 mb-4">
                                            The following questions are waiting for teacher evaluation:
                                        </p>

                                        <div className="space-y-3">
                                            {shortQuestions.map((q, index) => (
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
                                            ))}
                                        </div>

                                        <p className="mt-4 text-sm sm:text-base text-gray-700">
                                            Additional XP will be awarded after teacher review.
                                        </p>
                                    </motion.div>
                                )}

                                {reviewCompleted && !passed && (
                                    <div className="mb-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 hover:opacity-95 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition"
                                            onClick={() => {
                                                alert("Reappear feature will be enabled in the next phase.");
                                            }}
                                        >
                                            🔁 Reappear Exam
                                        </motion.button>
                                    </div>
                                )}

                                <h3 className="text-lg sm:text-xl font-bold text-[#6b1f0f] mb-4">
                                    Answer Review
                                </h3>

                                <motion.div variants={listContainerVariants} initial="hidden" animate="show">
                                    {mcqQuestions.map((q, index) => (
                                        <ReviewCard
                                            key={q.id}
                                            question={q}
                                            index={index}
                                            savedAnswers={savedAnswers}
                                        />
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <CompletionModal
                open={courseCompleted}
                xpEarned={xpEarnedForModal}
                passed={passed}
                onContinue={() => setCourseCompleted(false)}
            />
        </div>
    );
}
