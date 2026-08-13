"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

// Static array defined outside component render cycle
const PARTICLES = Array.from({ length: 8 });

export default function SignupPage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    studentId: "",
    email: "",
    password: "",
    role: "student",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // DIRECT MOTION VALUES (Bypasses React re-renders completely on mouse move)
  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);

  const springX = useSpring(mouseX, { stiffness: 70, damping: 30, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      mouseX.set(window.innerWidth / 2 - 350);
      mouseY.set(window.innerHeight / 2 - 350);
    }
  }, [mouseX, mouseY]);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    mouseX.set(e.clientX - 350);
    mouseY.set(e.clientY - 350);
  };

  const handleSignup = async () => {
    if (isLoading) return;
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await authService.register(form);

      if (res.id) {
        if (!prefersReducedMotion) {
          confetti({
            particleCount: 180,
            spread: 100,
            origin: { y: 0.55 },
          });
        }
        setShowSuccessModal(true);
      } else {
        setErrorMessage(res.message || "Something went wrong. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage("Server error. Please try again in a moment.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b0c07] via-[#3b130d] to-[#5c2412] overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* HARDWARE-ACCELERATED RADIAL GLOW (No heavy blur filter) */}
      {!prefersReducedMotion && (
        <motion.div
          style={{
            x: springX,
            y: springY,
          }}
          className="absolute w-[700px] h-[700px] pointer-events-none left-0 top-0 z-0 transform-gpu rounded-full bg-[radial-gradient(circle_at_center,_rgba(139,69,19,0.35)_0%,_transparent_70%)]"
        />
      )}

      {/* MULTI-PARTICLE SPARKLE FIELD */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
          {PARTICLES.map((_, i) => (
            <motion.div
              key={i}
              initial={{
                top: `${10 + i * 11}%`,
                left: `${15 + i * 9}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.15, 0.6, 0.15],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-2 h-2 rounded-full bg-[#d7a46b] blur-[1px] transform-gpu"
            />
          ))}
        </div>
      )}

      {/* SPLIT LAYOUT WRAPPER */}
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* LEFT PANEL: HERO TEXT — desktop only */}
        <div className="lg:col-span-5 flex-col justify-center text-center lg:text-left space-y-6 hidden lg:flex">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#d7a46b] text-sm tracking-widest uppercase font-bold bg-[#8b4513]/30 px-3 py-1 rounded-md border border-[#d7a46b]/20">
              Gamified Learning System
            </span>
            <h1 className="text-white text-4xl xl:text-5xl font-extrabold mt-4 tracking-tight leading-tight">
              Level Up Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7b882] to-[#a05a2c]">
                Academic Skills
              </span>
            </h1>
            <p className="text-gray-300 text-base xl:text-lg mt-4 max-w-md">
              Compete on your department&apos;s leaderboard, accumulate custom XP, and complete real-time tracking quests seamlessly.
            </p>
          </motion.div>

          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full aspect-square max-w-[320px] xl:max-w-[360px] mx-auto lg:mx-0 bg-gradient-to-tr from-[#431b11]/40 to-[#8b4513]/10 rounded-2xl border border-white/5 backdrop-blur-md relative flex items-center justify-center shadow-inner transform-gpu"
          >
            <GraduationCap size={140} className="text-[#d7a46b]/20 absolute" />
            <div className="absolute w-40 h-40 bg-[#8b4513] opacity-30 blur-3xl rounded-full" />
          </motion.div>
        </div>

        {/* RIGHT PANEL: SIGNUP FORM CARD */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl max-w-[500px] w-full p-6 sm:p-8 rounded-2xl hover:shadow-[0_0_60px_rgba(139,69,19,0.35)] transition-shadow duration-500 overflow-hidden transform-gpu"
          >
            {/* ANIMATED BORDER PULSE GLOW */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl border border-[#d7a46b]/20 pointer-events-none"
              />
            )}

            {/* FLOATING & ROTATING GRADUATION CAP */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : { y: [0, -8, 0], rotate: [0, 4, 0, -4, 0] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-4 transform-gpu"
            >
              <div className="bg-[#8b4513] p-4 rounded-full shadow-lg border border-white/10">
                <GraduationCap size={32} className="text-white" />
              </div>
            </motion.div>

            {/* HEADING & SUBTITLE */}
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
                Create Account
              </h2>
              <p className="text-gray-300/80 text-sm mt-1">
                Start your learning journey today
              </p>
            </div>

            {/* XP BADGE */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#8b4513]/30 border border-[#d7a46b]/30 px-4 py-1.5 rounded-full text-[#f3d4a2] text-xs font-semibold tracking-wide text-center">
                🎮 Join • Learn • Earn XP
              </div>
            </div>

            {/* INLINE ERROR */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ROLE SELECTION */}
            <div className="mb-4">
              <select
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student" className="bg-[#3b130d]">
                  Student
                </option>
                <option value="teacher" className="bg-[#3b130d]">
                  Teacher
                </option>
              </select>
            </div>

            {/* FULL NAME */}
            <div className="mb-4">
              <input
                placeholder="Full Name"
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* CONDITIONAL STUDENT FIELDS */}
            <AnimatePresence initial={false}>
              {form.role === "student" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mb-4">
                    <input
                      placeholder="Roll Number"
                      disabled={isLoading}
                      onKeyDown={handleKeyDown}
                      className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                      value={form.rollNo}
                      onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      placeholder="Student ID"
                      disabled={isLoading}
                      onKeyDown={handleKeyDown}
                      className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  disabled={isLoading}
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 pr-11 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus-visible:ring-2 focus-visible:ring-[#d7a46b]/60 hover:border-[#d7a46b]/50 transition-all disabled:opacity-60"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              onClick={handleSignup}
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-[#431b11] text-white py-3.5 rounded-lg text-lg sm:text-xl font-semibold shadow-md hover:bg-[#522216] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a46b]/70 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform-gpu"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                "Register"
              )}
            </motion.button>

            {/* LOWER LINK */}
            <div className="text-center mt-6">
              <p className="text-white/90 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold underline text-white hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative overflow-hidden bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-10 text-center transform-gpu"
            >
              {/* Floating Background Glow */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#8b4513]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#d7a46b]/20 rounded-full blur-3xl" />

              {/* Animated Celebration */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: [0, 12, -12, 0], scale: [1, 1.12, 1] }
                }
                transition={{ duration: 1, repeat: Infinity }}
                className="text-5xl sm:text-7xl transform-gpu"
              >
                🎉
              </motion.div>

              <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold text-[#6b1f0f]">
                Welcome!
              </h2>

              <p className="mt-4 text-lg sm:text-2xl font-bold text-gray-700">
                Account Created Successfully
              </p>

              <p className="mt-6 text-sm sm:text-base text-gray-500 leading-7 sm:leading-8">
                Welcome to
                <span className="font-bold text-[#8b4513]"> Gamified Learning</span>
                <br />
                Start earning XP, complete exciting courses, unlock achievements, and climb the leaderboard.
              </p>

              {/* XP Badge */}
              <div className="mt-8 flex justify-center">
                <div className="bg-[#8b4513]/10 border border-[#8b4513]/20 rounded-full px-6 py-3 text-sm sm:text-base">
                  🏆 Ready to begin your journey
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="mt-10 bg-[#8b4513] hover:bg-[#6b1f0f] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-colors transform-gpu"
              >
                Start Learning →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}