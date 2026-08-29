"use client";

import {
  Flame,
  Trophy,
  PlayCircle,
  Swords,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dashboardStatsService from "@/services/dashboardStatsService";
import badgeService from "@/services/badgeService";
import { API_URL } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    xp: 0,
    level: 1,
    rank: "-",
  });

  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const result = await dashboardStatsService.getMyRank(user.id);
      setStats(result);

      const userBadges = await badgeService.getUserBadges(user.id);
      setBadges(userBadges);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 min-h-screen pb-12 overflow-x-hidden">
      
      {/* FEATURE 8: SUBTLE DOT PATTERN BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#8b4513 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* FEATURE 3: PREMIUM GLOW BACKGROUND LAYER COORDINATES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#8b4513]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[#a0522d]/5 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 sm:px-6 lg:px-0 z-10">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#6b1f0f] tracking-tight flex items-center gap-2">
            Welcome Back{" "}
            {/* FEATURE 6: FLOATING WELCOME ICON */}
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className="inline-block origin-bottom-right"
            >
              👋
            </motion.span>
          </h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-base sm:text-lg">
            Keep learning. Earn XP. Climb the leaderboard.
          </p>
        </div>
        
        {/* Stage Indicator Badge */}
        <div className="self-start md:self-center bg-gradient-to-r from-[#8b4513] to-[#6b1f0f] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-md font-bold border border-[#a0522d]/20 text-center min-w-[120px]">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#eaded4] block">Current Stage</span>
          <span className="text-lg sm:text-xl">Level {stats.level}</span>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-0 text-sm font-medium text-gray-700 z-10">
        <div className="bg-white/80 backdrop-blur-sm p-3.5 sm:py-3 sm:px-5 rounded-xl border border-[#eaded4] shadow-sm flex items-center gap-2">
          <span className="text-base sm:text-lg">🎓</span> 
          <span className="text-gray-500 text-xs sm:text-sm">4 Courses Completed</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-3.5 sm:py-3 sm:px-5 rounded-xl border border-[#eaded4] shadow-sm flex items-center gap-2">
          <span className="text-base sm:text-lg">📝</span> 
          <span className="text-gray-500 text-xs sm:text-sm">12 Quizzes Taken</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-3.5 sm:py-3 sm:px-5 rounded-xl border border-[#eaded4] shadow-sm flex items-center gap-2">
          <span className="text-base sm:text-lg">🏆</span> 
          <span className="text-gray-500 text-xs sm:text-sm">{badges.length} Badges Earned</span>
        </div>
      </div>

      {/* STATS CONTENT CARDS GRID */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-0 z-10">
        
        {/* XP CARD WITH FEATURE 1: HOVER LIFT & SHADOW */}
        <div className="bg-gradient-to-br from-white to-[#fff6ef] rounded-2xl p-4 sm:p-6 shadow-md border border-[#eaded4] flex flex-col justify-between col-span-1 sm:col-span-2 xl:col-span-1 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div>
            <p className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-gray-400">
              Experience Points
            </p>
            <h3 className="text-4xl sm:text-5xl font-black text-[#8b4513] mt-1 sm:mt-2 tracking-tight">
              {stats.xp} <span className="text-lg sm:text-xl font-bold text-[#a0522d]">XP</span>
            </h3>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="w-full bg-gray-200 h-2.5 sm:h-3 rounded-full overflow-hidden shadow-inner relative">
              {/* FEATURE 4: ANIMATED FRAMER MOTION PROGRESS FILL */}
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.max(stats.xp % 100, 5)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#8b4513] to-[#a0522d] h-full rounded-full"
              />
            </div>
            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold text-gray-500 text-right">
              {100 - (stats.xp % 100)} XP to Next Level
            </p>
          </div>
        </div>

        {/* STREAK CARD WITH FEATURE 1: HOVER LIFT & SHADOW */}
        <div className="bg-gradient-to-br from-white to-[#fffcf5] rounded-2xl p-4 sm:p-6 shadow-md border border-[#eaded4] flex items-center gap-4 sm:gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-100 shadow-sm shrink-0">
            <Flame size={30} className="text-orange-500 sm:w-9 sm:h-9 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <p className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-gray-400">
              Daily Streak
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-[#8b4513] mt-0.5 sm:mt-1">
              7 Days
            </h3>
            <p className="text-[11px] sm:text-xs text-orange-600 font-medium mt-0.5">You're on fire! Keep it up.</p>
          </div>
        </div>

        {/* RANK CARD WITH FEATURE 1: HOVER LIFT & SHADOW */}
        <div className="bg-gradient-to-br from-white to-[#fdfbf7] rounded-2xl p-4 sm:p-6 shadow-md border border-[#eaded4] flex items-center gap-4 sm:gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm shrink-0">
            <Trophy size={30} className="text-yellow-500 sm:w-9 sm:h-9" />
          </div>
          <div>
            <p className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-gray-400">
              Global Rank
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-[#8b4513] mt-0.5 sm:mt-1">
              #{stats.rank}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Top 12% of all learners</p>
          </div>
        </div>

      </div>

      {/* ACHIEVEMENT GALLERY CARD CONTAINER */}
      <div className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-[#eaded4] mx-4 sm:px-6 lg:mx-0 z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#6b1f0f] flex items-center gap-2">
            🏆 Achievement Gallery
          </h2>
          
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5">
              <span>Gallery Progress</span>
              <span>{badges.length}/10 Badges</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#8b4513] to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((badges.length / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {badges.length === 0 ? (
          <div className="text-center py-8 sm:py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-gray-400 text-sm font-medium px-4">
              No badges unlocked yet. Start completing challenges to showcase your skills!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {badges
              .filter((badge) => badge)
              .map((badge) => (
                /* FEATURE 7: UPGRADED BADGE CARD HOVERS WITH RICH SHADOW ARCHITECTURE */
                <div
                  key={badge.id}
                  className="group border border-gray-100 rounded-xl p-3 sm:p-4 bg-[#f9f6f3] flex items-center gap-3 sm:gap-4 hover:border-[#d7a46b] hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <img
                    src={`${API_URL}/uploads/badges/${badge?.image}`}
                    alt={badge?.name}
                    className="w-20 h-20 object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                      {badge.name}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-0.5 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

      </div>

      {/* INTERACTIVE ACTION DECK */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-0 z-10">

        {/* QUIZ MODE WITH FEATURE 2: GRADIENT BACKGROUND */}
        <button className="bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between text-left group col-span-1">
          <div className="pr-2">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">Start Quiz</h4>
            <p className="text-xs sm:text-sm text-[#eaded4] mt-0.5 sm:mt-1 font-normal opacity-90 line-clamp-2">Test your mastery & earn instant raw XP.</p>
          </div>
          <PlayCircle size={28} className="text-white/90 sm:w-8 sm:h-8 shrink-0 group-hover:rotate-6 transition-transform" />
        </button>

        {/* DUEL MODE WITH FEATURE 2: GRADIENT BACKGROUND */}
        <button
          onClick={() => router.push("/duel")}
          className="bg-gradient-to-r from-[#6f311c] to-[#8b4513] text-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between text-left group col-span-1"
        >
          <div className="pr-2">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">Duel Mode</h4>
            <p className="text-xs sm:text-sm text-[#eaded4] mt-0.5 sm:mt-1 font-normal opacity-90 line-clamp-2">Challenge global peers in live battles.</p>
          </div>
          <Swords size={28} className="text-white/90 sm:w-8 sm:h-8 shrink-0 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* LEADERBOARD WITH FEATURE 2: GRADIENT BACKGROUND */}
        <Link href="/dashboard/leaderboard" className="block w-full col-span-1 sm:col-span-2 xl:col-span-1">
          <button className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between text-left group">
            <div className="pr-2">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight">Leaderboard</h4>
              <p className="text-xs sm:text-sm text-yellow-50 mt-0.5 sm:mt-1 font-normal opacity-90 line-clamp-2">See how you measure against the top 100.</p>
            </div>
            <Trophy size={28} className="text-white/90 sm:w-8 sm:h-8 shrink-0 group-hover:scale-110 transition-transform" />
          </button>
        </Link>

      </div>

    </div>
  );
}