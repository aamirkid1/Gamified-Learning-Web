"use client";

import authService from "@/services/authService";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // MOUSE POSITION STATE
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await authService.login(email, password, role);

      if (res.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(res.user));

        if (res.user.role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/dashboard");
        }
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
      // MOUSE GLOW TRACKING ON OUTERMOST CONTAINER
      onMouseMove={(e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }}
      className="relative min-h-screen bg-gradient-to-br from-[#2b0c07] via-[#3b130d] to-[#5c2412] overflow-hidden flex items-center justify-center"
    >
      
      {/* MOUSE-FOLLOWING PREMIUM GLOW EFFECT */}
      <motion.div
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 80,
          restDelta: 0.001
        }}
        className="absolute w-[600px] h-[600px] bg-[#8b4513] opacity-20 blur-[140px] rounded-full pointer-events-none left-0 top-0 z-0"
      />

      {/* 10. EXPANDED MULTI-PARTICLE FLOATING BACKGROUND SYSTEM */}
      <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i,
              ease: "easeInOut"
            }}
            className="absolute w-3 h-3 rounded-full bg-[#d7a46b] blur-sm"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + i * 9}%`,
            }}
          />
        ))}
      </div>

      {/* FLOATING WELCOME TEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-6 md:top-12 text-white/40 text-lg tracking-widest uppercase pointer-events-none font-medium"
      >
        Welcome Back
      </motion.p>

      {/* 1. MAIN SPLIT LAYOUT WRAPPER GRID */}
      <div className="relative z-10 max-w-7xl w-full min-h-screen px-6 sm:px-12 grid lg:grid-cols-2 items-center gap-12 lg:gap-16">
        
        {/* 2. HERO CONTENT DESIGN SYSTEM (LEFT SIDE) */}
        <div className="hidden lg:block space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-2 rounded-lg border border-[#d7a46b]/20 text-[#d7a46b] text-sm font-semibold tracking-widest mb-2 bg-[#8b4513]/10">
              GAMIFIED LEARNING SYSTEM
            </div>

            <h1 className="text-7xl font-extrabold leading-tight text-white tracking-tight">
              Welcome<br />
              Back To<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7b882] to-[#a05a2c]">
                Learning
              </span>
            </h1>

            <p className="text-gray-300 text-xl mt-6 max-w-xl font-light leading-relaxed">
              Continue your learning journey, track XP, unlock achievements, and climb your department's leaderboard.
            </p>

            {/* 3. FLOATING COMPETE XP BADGE */}
            <div className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full border border-[#d7a46b]/20 bg-[#8b4513]/20 text-[#f3d4a2] text-sm font-semibold shadow-md">
              🏆 Track XP • Earn Badges
            </div>
          </motion.div>
        </div>

        {/* AUTH FORM CARD INTERACTION WRAPPER (RIGHT SIDE) */}
        <div className="flex justify-center lg:justify-end w-full">
          {/* ANIMATED ENTRANCE, 4 & 5. EXPANDED glassmorphism W-500 CARD, 9. STRONGER GLOW */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 bg-white/5 backdrop-blur-xl border border-[#8b4513]/40 shadow-2xl max-w-[500px] w-full p-8 rounded-2xl hover:shadow-[0_0_100px_rgba(139,69,19,0.45)] transition-all duration-500 overflow-hidden"
          >
            {/* PREMIUM INSET SAAS BORDER OUTLINE */}
            <div className="absolute inset-0 rounded-2xl border border-[#d7a46b]/10 pointer-events-none" />

            {/* 6. EXTENDED FLOATING & ROTATING GRADUATION CAP ICON */}
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 4, 0, -4, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-4"
            >
              <div className="bg-[#8b4513] p-4 rounded-full shadow-lg border border-white/5">
                <GraduationCap size={32} className="text-white" />
              </div>
            </motion.div>

            {/* 7. RE-DESIGNED HEADING & SUBTITLE LAYOUT */}
            <div className="text-center mb-6">
              <h2 className="text-white text-3xl font-bold tracking-wide">
                Welcome Back
              </h2>
              <p className="text-gray-300/80 text-sm mt-1">
                Continue your learning journey
              </p>
            </div>

            {/* 8. XP ACHIEVEMENTS TRACKING SYSTEM BADGE */}
            <div className="flex justify-center mb-6">
              <div className="px-4 py-1.5 rounded-full bg-[#8b4513]/30 border border-[#d7a46b]/20 text-[#f3d4a2] text-xs font-semibold tracking-wide">
                🎮 XP • Achievements • Leaderboards
              </div>
            </div>

            {/* ROLE */}
            <div className="mb-4">
              <select
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student" className="bg-[#3b130d]">Student</option>
                <option value="teacher" className="bg-[#3b130d]">Teacher</option>
              </select>
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <input
                type="password"
                placeholder="Password"
                disabled={isLoading}
                className="w-full p-3 bg-black/25 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#d7a46b] focus:scale-[1.01] hover:border-[#d7a46b]/50 focus:shadow-lg focus:shadow-[#8b4513]/30 transition-all disabled:opacity-60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ANIMATED SIGN IN BUTTON */}
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-[#431b11] text-white py-3.5 rounded-lg text-xl font-semibold shadow-md hover:bg-[#522216] transition-colors focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {/* Shine Sweep Overlay */}
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
              
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                "Login"
              )}
            </motion.button>

            {/* FOOTER LINKS */}
            <div className="text-center mt-6">
              <p className="text-gray-300/90 text-sm mb-3">
                Forgot password? Contact your department
              </p>

              <p className="text-white/90 text-sm">
                New here?{" "}
                <Link
                  href="/signup"
                  className="font-semibold underline text-white hover:text-gray-300 transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}