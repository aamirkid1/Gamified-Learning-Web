"use client";

import { motion, AnimatePresence } from "framer-motion";

const OPTION_KEYS = ["A", "B", "C", "D"];

export const questionItemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function QuestionCard({
    question,
    index,
    answers,
    onToggleOption,
    onShortAnswerChange,
}) {
    const selected = answers[question.id] || [];
    const shortValue = typeof answers[question.id] === "string" ? answers[question.id] : "";
    const isAnswered =
        question.type === "mcq" ? selected.length > 0 : shortValue.trim().length > 0;

    return (
        <motion.div
            variants={questionItemVariants}
            className="mb-6 sm:mb-8 p-4 sm:p-6 border border-[#eaded4] rounded-2xl bg-white hover:border-[#e0c9b8] hover:shadow-md transition-all duration-300"
        >
            <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-[#fdf1e8] text-[#8b4513] font-bold text-sm">
                    {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-xl font-semibold text-[#3a1f14] break-words">
                        {question.question}
                    </h2>
                    <span className="inline-block mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide bg-[#f3e5da] text-[#8b4513] px-2.5 py-1 rounded-full">
                        {question.type === "mcq" ? "Multiple Choice" : "Short Answer"}
                    </span>
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 22 }}
                            className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-500 text-white text-xs"
                            aria-label="Answered"
                        >
                            ✓
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {question.type === "mcq" && (
                <div className="space-y-2.5 sm:pl-11">
                    {OPTION_KEYS.map((key) => {
                        const text = question[`option${key}`];
                        const isChecked = selected.includes(key);

                        return (
                            <motion.label
                                key={key}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-start gap-2 cursor-pointer p-3 rounded-xl border transition-colors duration-200 ${
                                    isChecked
                                        ? "bg-[#fdf3ec] border-[#8b4513]"
                                        : "bg-white border-[#eaded4] hover:bg-[#faf6f1]"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 flex-shrink-0 accent-[#8b4513]"
                                    checked={isChecked}
                                    onChange={() => onToggleOption(question.id, key)}
                                />
                                <span className="text-sm sm:text-base break-words text-[#3a1f14]">
                                    {text}
                                </span>
                            </motion.label>
                        );
                    })}
                </div>
            )}

            {question.type === "short" && (
                <div className="sm:pl-11">
                    <textarea
                        className="w-full border border-[#eaded4] p-3 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#8b4513]/40 focus:border-[#8b4513] transition-shadow duration-200"
                        rows={4}
                        placeholder="Write your answer here..."
                        value={shortValue}
                        onChange={(e) => onShortAnswerChange(question.id, e.target.value)}
                    />
                </div>
            )}
        </motion.div>
    );
}
