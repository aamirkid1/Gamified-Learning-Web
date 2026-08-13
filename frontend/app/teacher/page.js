"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  FileQuestion,
  ClipboardList,
  Layers,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import dashboardService from "@/services/dashboardService";

const QUICK_ACTIONS = [
  {
    href: "/teacher/courses",
    icon: BookOpen,
    title: "My Courses",
    body: "Curriculum tracks, student access, and core modules.",
    cta: "Open Creator",
  },
  {
    href: "/teacher/create-lesson",
    icon: GraduationCap,
    title: "Add Lesson",
    body: "Upload files, video content, and reading materials.",
    cta: "Add Content",
  },
  {
    href: "/teacher/create-quiz",
    icon: FileQuestion,
    title: "Create Quiz",
    body: "Assessments, MCQs, and student evaluation.",
    cta: "Create Quiz",
  },
  {
    href: "/teacher/review-answers",
    icon: ClipboardList,
    title: "Review Answers",
    body: "Review submissions, assign scores, and award XP.",
    cta: "Open Reviews",
  },
  {
    href: "/teacher/flashcards",
    icon: Layers,
    title: "Flashcards",
    body: "Manage flashcard decks for student practice.",
    cta: "Manage Decks",
  },
];

// Animated count-up for stat cards
function AnimatedStat({ value }) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.9,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, prefersReducedMotion, motionValue]);

  return <>{display}</>;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    activeQuizzes: 0,
  });

  const prefersReducedMotion = useReducedMotion();

  const loadStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.id) {
        const data = await dashboardService.getStats(user.id);
        setStats(data || { totalCourses: 0, totalLessons: 0, activeQuizzes: 0 });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const STAT_CARDS = [
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen },
    { label: "Active Lessons", value: stats.totalLessons, icon: GraduationCap },
    { label: "Active Quizzes", value: stats.activeQuizzes, icon: FileQuestion },
  ];

  const fadeSlideUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const gridContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const gridItem = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#3b130d] text-white font-sans selection:bg-[#6f311c] overflow-x-hidden">
      {/* Dynamic Background Glow Orbs */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-6 sm:right-20 w-64 h-64 sm:w-[400px] sm:h-[400px] bg-[#a0522d]/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-20 left-6 sm:left-20 w-48 h-48 sm:w-[300px] sm:h-[300px] bg-[#8b4513]/10 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Top Accent Strip */}
      <div className="h-2 bg-[#6b1f0f] w-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#8b4513]/90 backdrop-blur-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 shadow-xl border-b border-[#6b1f0f]/40 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-20 top-0 w-72 h-72 bg-white/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlideUp}
          className="relative max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-1 font-medium">
              Manage courses, lessons, and track student assessments.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#3b130d]/40 px-3.5 sm:px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                {!prefersReducedMotion && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                )}
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-gray-200 uppercase">
                Instructor Portal
              </span>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-[#5a1205] border border-[#a0522d] text-white text-sm font-semibold shadow-lg hover:bg-[#7a1a08] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4513] cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-gray-200" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12 space-y-12 sm:space-y-16">
        {/* Quick Actions Grid Section */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeSlideUp}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-[#8b4513] rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-100">
                Quick Actions
              </h2>
            </div>
            <span className="text-xs text-gray-300/80 font-medium hidden sm:inline-block">
              Select an action to begin managing your workflow
            </span>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={gridContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5"
          >
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.href} variants={gridItem}>
                  <Link
                    href={action.href}
                    className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b4513] rounded-2xl"
                  >
                    <div className="relative h-full bg-[#6f311c] border border-[#8b4513]/60 group-hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-xl group-hover:shadow-[0_15px_50px_rgba(255,255,255,0.08)] group-hover:-translate-y-1.5 group-hover:bg-[#6f311c]/90 overflow-hidden">
                      {/* Top Edge Highlight */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div>
                        {/* Icon Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 bg-[#3b130d]/60 rounded-xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5.5 h-5.5 text-gray-100" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-300 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all">
                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-white group-hover:text-gray-100 transition-colors mb-1.5">
                          {action.title}
                        </h3>
                        <p className="text-gray-300/90 text-xs leading-relaxed line-clamp-3 mb-4">
                          {action.body}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#431b11] group-hover:bg-[#35140d] text-white text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 border border-transparent group-hover:border-white/10 shadow-md">
                        <span>{action.cta}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Overview Performance Stats Section */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeSlideUp}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-6 w-1 bg-[#8b4513] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-100">
              Overview Performance
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={gridContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {STAT_CARDS.map(({ label, value, icon: Icon }) => (
              <motion.div
                key={label}
                variants={gridItem}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-br from-[#6f311c] to-[#592413] p-5 sm:p-6 rounded-2xl shadow-lg border border-[#8b4513]/40 hover:shadow-xl transition-all duration-300 group"
              >
                <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#8b4513] to-[#5a1205]" />
                <div className="flex items-center justify-between gap-4 pl-2">
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 truncate">
                      {label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      <AnimatedStat value={value} />
                    </p>
                  </div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-[#3b130d]/50 border border-white/10 rounded-xl flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}