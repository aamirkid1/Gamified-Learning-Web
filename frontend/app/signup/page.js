"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    studentId: "",
    email: "",
    password: "",
    role: "student",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSignup = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await authService.register(form);

      if (res.id) {
        alert("Registration successful");
        router.push("/login");
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onMouseMove={(e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }}
      // 3. STRONG GRADIENT BACKGROUND DYNAMICS
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b0c07] via-[#3b130d] to-[#5c2412] overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      
      {/* MOUSE-FOLLOWING PREMIUM GLOW */}
      <motion.div
        animate={{
          x: mousePosition.x - 350,
          y: mousePosition.y - 350,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 70,
          restDelta: 0.001
        }}
        className="absolute w-[700px] h-[700px] bg-[#8b4513] opacity-25 blur-[150px] rounded-full pointer-events-none left-0 top-0 z-0"
      />

      {/* 10. MULTI-PARTICLE SYSTEM SPARKLE FIELD (8 Floating Dots) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.15, 0.6, 0.15]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 rounded-full bg-[#d7a46b] blur-[1px]"
          />
        ))}
      </div>

      {/* 2. SPLIT LAYOUT WRAPPER CONTAINER */}
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT PANEL: HERO TEXT & ILLU ANCHOR CONTAINER */}
        <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left space-y-6 hidden lg:flex">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#d7a46b] text-sm tracking-widest uppercase font-bold bg-[#8b4513]/30 px-3 py-1 rounded-md border border-[#d7a46b]/20">
              Gamified Learning System
            </span>
            <h1 className="text-white text-5xl font-extrabold mt-4 tracking-tight leading-tight">
              Level Up Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7b882] to-[#a05a2c]">
                Academic Skills
              </span>
            </h1>
            <p className="text-gray-300 text-lg mt-4 max-w-md">
              Compete on your department's leaderboard, accumulate custom XP, and complete real-time tracking quests seamlessly.
            </p>
          </motion.div>

          {/* Graphical placeholder container matching theme (Can embed Lottie or PNG inside) */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full aspect-square max-w-[360px] mx-auto lg:mx-0 bg-gradient-to-tr from-[#431b11]/40 to-[#8b4513]/10 rounded-2xl border border-white/5 backdrop-blur-md relative flex items-center justify-center shadow-inner"
          >
            <GraduationCap size={140} className="text-[#d7a46b]/20 absolute" />
            <div className="absolute w-40 h-40 bg-[#8b4513] opacity-30 blur-3xl rounded-full" />
          </motion.div>
        </div>

        {/* RIGHT PANEL: UPGRADED SIGNUP FORM CARD */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            // 1. EXTENDED CARD TO WIDER 500PX CONTAINER WITH ULTRA-MODERN PURE GLASSMORPHISM (4. bg-white/5)
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[500px] w-full p-8 rounded-2xl hover:shadow-[0_0_60px_rgba(139,69,19,0.35)] transition-all duration-500 overflow-hidden"
          >
            {/* 5. ANIMATED BORDER PULSE GLOW OUTLINE */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl border border-[#d7a46b]/20 pointer-events-none"
            />

            {/* 6. EXTENDED FLOATING & ROTATING GRADUATION CAP */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 4, 0, -4, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-4"
            >
              <div className="bg-[#8b4513] p-4 rounded-full shadow-lg border border-white/10">
                <GraduationCap size={32} className="text-white" />
              </div>
            </motion.div>

            {/* 7. PREMIUM HEADING & SUBTITLE SYSTEM */}
            <div className="text-center mb-6">
              <h2 className="text-white text-3xl font-bold tracking-wide">
                Create Account
              </h2>
              <p className="text-gray-300/80 text-sm mt-1">
                Start your learning journey today
              </p>
            </div>

            {/* 9. THEME XP BADGE */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#8b4513]/30 border border-[#d7a46b]/30 px-4 py-1.5 rounded-full text-[#f3d4a2] text-xs font-semibold tracking-wide">
                🎮 Join • Learn • Earn XP
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div className="mb-4">
              <select
                disabled={isLoading}
                // 8. DEEP BLACK INSIGHT INPUT FIELD SYSTEM (bg-black/25, hover effects, subtle tracking scale tweaks)
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                <option value="student" className="bg-[#3b130d]">Student</option>
                <option value="teacher" className="bg-[#3b130d]">Teacher</option>
              </select>
            </div>

            {/* FULL NAME INPUT */}
            <div className="mb-4">
              <input
                placeholder="Full Name"
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* DYNAMIC STUDENT CONDITIONAL FIELDS */}
            {form.role === "student" && (
              <>
                <div className="mb-4">
                  <input
                    placeholder="Roll Number"
                    disabled={isLoading}
                    className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                    value={form.rollNo}
                    onChange={(e) =>
                      setForm({ ...form, rollNo: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Student ID"
                    disabled={isLoading}
                    className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* EMAIL INPUT */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* BUTTON WITH SHINE GRAPHICS */}
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              onClick={handleSignup}
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-[#431b11] text-white py-3.5 rounded-lg text-xl font-semibold shadow-md hover:bg-[#522216] transition-colors focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {/* Shine sweep asset overlay */}
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
              
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                "Register"
              )}
            </motion.button>

            {/* LOWER LINK ATTACHMENTS */}
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
    </div>
  );
}