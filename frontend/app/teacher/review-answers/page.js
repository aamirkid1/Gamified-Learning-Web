"use client";

import { useEffect, useState } from "react";
import reviewAnswerService from "@/services/reviewAnswerService";
import { useRouter } from "next/navigation";

/**
 * "Review Ledger" — a grading console for short-answer quiz submissions.
 * Design concept: a teacher's grading ledger. Oxblood ink, parchment paper,
 * faint ruled lines, and a mono "stamp" for record numbers. Each question
 * is a numbered ledger entry; each mark you enter fills a brass tally bar
 * so progress toward the max is visible at a glance.
 */

const FONT_IMPORT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

  .rl-root {
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    background-color: #f3ede1;
    background-image: repeating-linear-gradient(
      to bottom,
      rgba(92, 26, 13, 0.05) 0px,
      rgba(92, 26, 13, 0.05) 1px,
      transparent 1px,
      transparent 34px
    );
  }
  .rl-display {
    font-family: 'Fraunces', ui-serif, Georgia, serif;
    font-optical-sizing: auto;
  }
  .rl-mono {
    font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;
  }
  @keyframes rl-rise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: no-preference) {
    .rl-animate {
      animation: rl-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  }
  .rl-fill {
    transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

export default function ReviewAnswers() {
    const [attempts, setAttempts] = useState([]);
    const [scores, setScores] = useState({});
    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);
    const [toast, setToast] = useState(null);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 2600);
        return () => clearTimeout(timer);
    }, [toast]);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const data = await reviewAnswerService.getPending(user.id);
            setAttempts(data || []);

            const questionMap = {};
            for (const attempt of data || []) {
                const answers = JSON.parse(attempt.answers || "{}");
                for (const questionId of Object.keys(answers)) {
                    if (questionMap[questionId]) continue;
                    try {
                        const question = await reviewAnswerService.getQuestion(questionId);
                        questionMap[questionId] = question;
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            setQuestions(questionMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (attemptId, questionId, rawValue) => {
        const max = Number(questions[questionId]?.marks ?? 0);
        const value = Math.max(0, Number(rawValue) || 0);

        if (value > max) {
            alert(`Maximum marks for this question is ${max}`);
            return;
        }

        setScores((prev) => ({
            ...prev,
            [`${attemptId}-${questionId}`]: value,
        }));
    };

    const getAttemptTotals = (attemptId, shortAnswers) => {
        let earned = 0;
        let max = 0;
        for (const [questionId] of shortAnswers) {
            earned += Number(scores[`${attemptId}-${questionId}`] || 0);
            max += Number(questions[questionId]?.marks || 0);
        }
        return { earned, max };
    };

    const submitReview = async (attemptId, shortAnswers) => {
        const { earned } = getAttemptTotals(attemptId, shortAnswers);
        setSubmittingId(attemptId);
        try {
            await reviewAnswerService.review(attemptId, earned);
            // setToast(`Attempt #${attemptId} graded — ${earned} marks recorded.`);
            setToast(true);
            await loadData();
        } catch (err) {
            console.error(err);
            alert("Something went wrong while submitting the review. Please try again.");
        } finally {
            setSubmittingId(null);
        }
    };

    return (
        <div className="rl-root min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
            <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT_STYLES }} />

            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#5c1a0d] px-6 py-8 text-[#f3ede1] shadow-[0_20px_50px_-20px_rgba(92,26,13,0.6)] sm:px-10 sm:py-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
                        }}
                    />

                    <div className="mb-6 flex justify-between items-center">

                        <button
                            onClick={() => router.push("/teacher")}
                            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition"
                        >
                            ← Dashboard
                        </button>

                    </div>


                    <p className="rl-mono relative mb-3 text-xs uppercase tracking-[0.25em] text-[#e8b98a]">
                        Grading Console
                    </p>
                    <h1 className="rl-display relative text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-tight">
                        Review Ledger
                    </h1>
                    <p className="relative mt-3 max-w-xl text-[15px] text-[#f3ede1]/80 sm:text-base">
                        Evaluate short-answer responses, assign marks, and post each
                        attempt's score in one pass.
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="space-y-4">
                        {[0, 1].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-3xl border border-[#e3d5c2] bg-[#fffdf9] p-8 shadow-sm"
                            >
                                <div className="mb-4 h-5 w-40 rounded-full bg-[#eee1d1]" />
                                <div className="mb-2 h-4 w-64 rounded-full bg-[#eee1d1]" />
                                <div className="h-24 w-full rounded-2xl bg-[#f4ede1]" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && attempts.length === 0 && (
                    <div className="rl-animate rounded-3xl border border-[#e3d5c2] bg-[#fffdf9] p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3ede1]">
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 13l4 4L19 7"
                                    stroke="#5c1a0d"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h2 className="rl-display text-2xl font-semibold text-[#5c1a0d]">
                            The ledger is clear
                        </h2>
                        <p className="mt-2 text-[15px] text-[#8a7c68]">
                            Every short-answer submission has been reviewed. New attempts
                            will appear here as students submit them.
                        </p>
                    </div>
                )}

                {/* Attempts */}
                {!loading && attempts.length > 0 && (
                    <div className="space-y-6">
                        {attempts.map((attempt, attemptIndex) => {
                            const answers = JSON.parse(attempt.answers || "{}");
                            const shortAnswers = Object.entries(answers).filter(
                                ([questionId]) => questions[questionId]?.type === "short"
                            );

                            if (shortAnswers.length === 0) return null;

                            const { earned, max } = getAttemptTotals(
                                attempt.id,
                                shortAnswers
                            );
                            const progressPct = max > 0 ? Math.min(100, (earned / max) * 100) : 0;
                            const isSubmitting = submittingId === attempt.id;

                            return (
                                <div
                                    key={attempt.id}
                                    className="rl-animate overflow-hidden rounded-3xl border border-[#e3d5c2] bg-[#fffdf9] shadow-[0_12px_30px_-18px_rgba(92,26,13,0.35)]"
                                    style={{ animationDelay: `${attemptIndex * 60}ms` }}
                                >
                                    {/* Card header */}
                                    <div className="flex flex-col gap-4 border-b border-[#eee1d1] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                                        <div className="flex items-start gap-4">
                                            <span className="rl-mono flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e3d5c2] bg-[#f8f2e6] text-sm font-semibold text-[#5c1a0d]">
                                                #{attempt.id}
                                            </span>
                                            <div>
                                                <h2 className="rl-display text-xl font-semibold text-[#5c1a0d] sm:text-2xl">
                                                    Attempt Record
                                                </h2>
                                                <p className="rl-mono mt-1 text-xs text-[#8a7c68] sm:text-sm">
                                                    Student {attempt.userId} · Quiz {attempt.quizId}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                                            <span className="rl-mono inline-flex items-center gap-1.5 rounded-full border border-[#e8c99a] bg-[#fbf1de] px-3 py-1 text-xs font-medium text-[#96631f]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#c98a2a]" />
                                                Pending review
                                            </span>
                                            <span className="rl-mono text-xs text-[#8a7c68]">
                                                {earned}/{max} marks
                                            </span>
                                        </div>
                                    </div>

                                    {/* Questions */}
                                    <div className="divide-y divide-[#eee1d1]">
                                        {shortAnswers.map(([questionId, answer], qIndex) => {
                                            const question = questions[questionId];
                                            const questionMax = Number(question?.marks || 0);
                                            const currentScore =
                                                scores[`${attempt.id}-${questionId}`] || 0;
                                            const fillPct =
                                                questionMax > 0
                                                    ? Math.min(100, (currentScore / questionMax) * 100)
                                                    : 0;
                                            const inputId = `score-${attempt.id}-${questionId}`;

                                            return (
                                                <div key={questionId} className="px-6 py-6 sm:px-8">
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="flex flex-1 gap-4">
                                                            <span className="rl-mono mt-1 shrink-0 text-sm font-medium text-[#c98a2a]">
                                                                {String(qIndex + 1).padStart(2, "0")}
                                                            </span>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="rl-display text-base font-semibold text-[#5c1a0d] sm:text-lg">
                                                                    {question?.question || "Untitled question"}
                                                                </p>

                                                                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-[#8a7c68]">
                                                                    Student answer
                                                                </p>
                                                                <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-[#eee1d1] bg-[#faf5eb] p-4 text-sm leading-relaxed text-[#3d3226]">
                                                                    {answer || (
                                                                        <span className="italic text-[#a89a83]">
                                                                            No answer provided
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mark entry */}
                                                        <div className="w-full shrink-0 lg:w-48">
                                                            <label
                                                                htmlFor={inputId}
                                                                className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#8a7c68] lg:text-right"
                                                            >
                                                                Marks
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    id={inputId}
                                                                    type="number"
                                                                    min={0}
                                                                    max={questionMax}
                                                                    value={currentScore || ""}
                                                                    placeholder="0"
                                                                    onChange={(e) =>
                                                                        handleScoreChange(
                                                                            attempt.id,
                                                                            questionId,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="rl-mono w-full rounded-xl border border-[#e3d5c2] bg-white px-3 py-2.5 text-sm font-medium text-[#3d3226] outline-none transition focus:border-[#c98a2a] focus:ring-2 focus:ring-[#c98a2a]/30"
                                                                />
                                                                <span className="rl-mono shrink-0 text-sm text-[#8a7c68]">
                                                                    / {questionMax}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eee1d1]">
                                                                <div
                                                                    className="rl-fill h-full rounded-full bg-gradient-to-r from-[#c98a2a] to-[#5c1a0d]"
                                                                    style={{ width: `${fillPct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex flex-col gap-4 border-t border-[#eee1d1] bg-[#faf5eb] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                                        <div className="w-full sm:max-w-xs">
                                            <div className="mb-1.5 flex items-center justify-between text-xs">
                                                <span className="font-medium uppercase tracking-wide text-[#8a7c68]">
                                                    Total
                                                </span>
                                                <span className="rl-mono font-semibold text-[#5c1a0d]">
                                                    {earned} / {max}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#eee1d1]">
                                                <div
                                                    className="rl-fill h-full rounded-full bg-gradient-to-r from-[#c98a2a] to-[#5c1a0d]"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => submitReview(attempt.id, shortAnswers)}
                                            disabled={isSubmitting}
                                            className="rl-display inline-flex items-center justify-center rounded-xl bg-[#5c1a0d] px-6 py-3 text-sm font-semibold text-[#f3ede1] shadow-[0_10px_25px_-10px_rgba(92,26,13,0.7)] transition hover:bg-[#4a1509] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSubmitting ? "Submitting…" : "Submit review"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Toast */}
            {/* Premium Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[9999]">
                    <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-white px-5 py-4 shadow-2xl animate-[rl-rise_.35s]">

                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <span className="text-xl">✓</span>
                        </div>

                        <div>
                            <h3 className="font-semibold text-green-700">
                                Review Submitted
                            </h3>

                            <p className="mt-1 text-sm text-gray-600">
                                Student evaluation updated successfully.
                            </p>

                            <p className="text-sm text-gray-600">
                                XP awarded successfully.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
