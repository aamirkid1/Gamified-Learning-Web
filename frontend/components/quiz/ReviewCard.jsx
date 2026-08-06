"use client";

import { motion } from "framer-motion";

const OPTION_KEYS = ["A", "B", "C", "D"];

export const reviewItemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function ReviewCard({ question, index, savedAnswers }) {
    const selected = savedAnswers[question.id] || [];
    const correct = question.correctAnswers.split(",").map((c) => c.trim());

    return (
        <motion.div
            variants={reviewItemVariants}
            className="border border-[#eaded4] rounded-2xl p-4 sm:p-5 mb-5 bg-white"
        >
            <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-lg bg-[#fdf1e8] text-[#8b4513] font-bold text-xs">
                    {index + 1}
                </span>
                <h3 className="font-bold text-sm sm:text-base break-words text-[#3a1f14]">
                    {question.question}
                </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:pl-10">
                Correct Answer:{" "}
                <span className="font-semibold text-green-700">{question.correctAnswers}</span>
            </p>

            <div className="sm:pl-10 space-y-2">
                {OPTION_KEYS.map((key) => {
                    const text = question[`option${key}`];
                    let cls = "bg-white border-[#eaded4]";

                    if (correct.includes(key)) {
                        cls = "bg-green-50 border-green-400";
                    }
                    if (selected.includes(key) && !correct.includes(key)) {
                        cls = "bg-red-50 border-red-400";
                    }

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * OPTION_KEYS.indexOf(key) }}
                            className={`flex items-center gap-2 border rounded-xl p-2.5 text-sm sm:text-base break-words ${cls}`}
                        >
                            <span className="font-semibold text-[#8b4513]">{key}.</span>
                            <span className="text-[#3a1f14]">{text}</span>
                            {correct.includes(key) && (
                                <span className="ml-auto text-green-600">✓</span>
                            )}
                            {selected.includes(key) && !correct.includes(key) && (
                                <span className="ml-auto text-red-600">✕</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
