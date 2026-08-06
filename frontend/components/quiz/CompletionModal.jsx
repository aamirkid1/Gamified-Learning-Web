"use client";

import { motion, AnimatePresence } from "framer-motion";
import useCountUp from "@/lib/useCountUp";

const CONFETTI = ["#8b4513", "#c26a2c", "#f4c95d", "#6b1f0f", "#2f9e44"];

function ConfettiBurst() {
    // 18 small pieces flung outward from center on mount, purely decorative.
    const pieces = Array.from({ length: 18 });

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            {pieces.map((_, i) => {
                const angle = (i / pieces.length) * Math.PI * 2;
                const distance = 90 + Math.random() * 80;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance - 40;
                const color = CONFETTI[i % CONFETTI.length];

                return (
                    <motion.span
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                        animate={{
                            opacity: 0,
                            x,
                            y: y + 120,
                            scale: 1,
                            rotate: (i % 2 === 0 ? 1 : -1) * 220,
                        }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
                        style={{
                            position: "absolute",
                            top: "12%",
                            left: "50%",
                            width: 8,
                            height: 8,
                            borderRadius: i % 3 === 0 ? "9999px" : "2px",
                            backgroundColor: color,
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function CompletionModal({ open, xpEarned, passed, onContinue }) {
    const animatedXp = useCountUp(open ? xpEarned : 0, { duration: 1100 });

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className="relative bg-white rounded-3xl p-6 sm:p-10 w-full max-w-2xl shadow-2xl"
                    >
                        <ConfettiBurst />

                        <div className="relative text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
                                className="text-6xl sm:text-7xl mb-5"
                            >
                                🎉
                            </motion.div>

                            <h2 className="text-3xl sm:text-5xl font-bold text-[#6b1f0f]">
                                Congratulations!
                            </h2>

                            <p className="mt-4 text-base sm:text-xl text-gray-600">
                                Course Completed Successfully
                            </p>

                            <div className="mt-8 bg-[#f7f2ed] rounded-2xl p-5 sm:p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-gray-500 text-sm sm:text-base">XP Earned</p>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-[#8b4513] tabular-nums">
                                            +{animatedXp}
                                        </h3>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm sm:text-base">Result</p>
                                        <h3
                                            className={`text-2xl sm:text-3xl font-bold ${
                                                passed ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            {passed ? "PASSED" : "FAILED"}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-sm sm:text-base text-gray-500">
                                Your certificate is ready to be generated.
                            </p>

                            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
                                <button
                                    disabled
                                    className="px-7 py-3 rounded-xl bg-gray-300 text-gray-600 cursor-not-allowed"
                                >
                                    View Certificate
                                </button>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onContinue}
                                    className="px-8 py-3 rounded-xl bg-[#8b4513] text-white font-semibold shadow-md"
                                >
                                    Continue Learning
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
