"use client";

import { motion } from "framer-motion";

/**
 * Sticky bar that tracks how many questions have been answered so far.
 * This is the one "signature" motion moment on the page — it's tied
 * directly to what the student is doing (answering), not decorative.
 */
export default function AnsweredProgressBar({ answeredCount, totalCount }) {
    const pct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

    return (
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 md:-mx-8 mb-5 sm:mb-6 px-4 sm:px-6 md:px-8 py-3 bg-[#f8f4ef]/90 backdrop-blur-sm border-b border-[#eaded4]">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-[#eaded4] overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#8b4513] to-[#c26a2c]"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                </div>
                <span className="flex-shrink-0 text-xs sm:text-sm font-semibold text-[#6b1f0f] tabular-nums">
                    {answeredCount}/{totalCount} answered
                </span>
            </div>
        </div>
    );
}
