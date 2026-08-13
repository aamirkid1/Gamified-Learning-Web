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
    <div className="relative min-h-screen bg-[#2a0c06] text-white font-sans selection:bg-[#e0a976] selection:text-[#2a0c06] overflow-x-hidden">
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-6 sm:right-20 w-64 h-64 sm:w-[400px] sm:h-[400px] bg-[#a0522d]/15 blur-[150px] rounded-full" />
          <div className="absolute bottom-20 left-6 sm:left-20 w-48 h-48 sm:w-[300px] sm:h-[300px] bg-[#e0a976]/10 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Top Gold Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#6b1f0f] via-[#e0a976] to-[#6b1f0f] w-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#3d140a]/90 backdrop-blur-xl px-4 sm:px-6 md:px-12 py-5 sm:py-6 shadow-2xl border-b border-[#e0a976]/20 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlideUp}
          className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Teacher Dashboard
            </h1>
            <p className="text-[#d8c3be] text-xs sm:text-sm md:text-base mt-1 font-medium">
              Manage courses, lessons, and track student assessments.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#2a0c06]/60 px-3.5 sm:px-4 py-2 rounded-xl border border-[#e0a976]/20 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                {!prefersReducedMotion && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                )}
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wide text-gray-200 uppercase">
                Instructor Portal
              </span>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-[#5a1205] border border-[#a0522d] text-white text-sm font-semibold shadow-lg hover:bg-[#7a1a08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a976] cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#e0a976]" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 space-y-12">
        {/* Quick Actions Grid Section */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeSlideUp}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-[#e0a976] rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Quick Actions
              </h2>
            </div>
            <span className="text-xs text-[#e0a976]/80 font-medium hidden sm:inline-block">
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
                    className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a976] rounded-2xl"
                  >
                    <div className="relative h-full bg-gradient-to-br from-[#3d140a]/90 via-[#2a0c06]/95 to-[#1d0703]/90 border border-[#e0a976]/25 group-hover:border-[#e0a976]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-xl group-hover:shadow-[0_12px_30px_rgba(224,169,118,0.15)] group-hover:-translate-y-1 overflow-hidden">
                      {/* Top Edge Gradient Glow on Hover */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e0a976]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div>
                        {/* Icon Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 bg-gradient-to-br from-[#e0a976]/20 to-[#5a1a08]/80 rounded-xl flex items-center justify-center border border-[#e0a976]/30 shadow-md group-hover:scale-105 transition-transform duration-300">
                            <Icon className="w-5.5 h-5.5 text-[#e0a976]" />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#e0a976]/10 flex items-center justify-center text-[#e0a976] opacity-60 group-hover:opacity-100 group-hover:bg-[#e0a976]/20 transition-all">
                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-white group-hover:text-[#fce4c8] transition-colors mb-1.5">
                          {action.title}
                        </h3>
                        <p className="text-gray-300/80 text-xs leading-relaxed line-clamp-3 mb-4">
                          {action.body}
                        </p>
                      </div>

                      {/* CTA Button Accent */}
                      <div className="mt-2 w-full py-2 px-3 rounded-xl bg-[#210904] group-hover:bg-gradient-to-r group-hover:from-[#e0a976] group-hover:to-[#b8763f] text-[#e0a976] group-hover:text-[#2a0c06] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 border border-[#e0a976]/20 group-hover:border-transparent shadow-sm">
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
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-6 w-1 bg-[#e0a976] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
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
                className="relative overflow-hidden bg-gradient-to-br from-[#3d140a] to-[#2a0c06] p-5 sm:p-6 rounded-2xl shadow-xl border border-[#e0a976]/30 hover:border-[#e0a976]/60 transition-all duration-300 group"
              >
                <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#e0a976] to-[#a0522d]" />
                <div className="flex items-center justify-between gap-4 pl-2">
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#e0a976]/80 mb-1 truncate">
                      {label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      <AnimatedStat value={value} />
                    </p>
                  </div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-[#e0a976]/10 border border-[#e0a976]/20 rounded-xl flex items-center justify-center text-[#e0a976] shadow-inner group-hover:scale-110 transition-transform">
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