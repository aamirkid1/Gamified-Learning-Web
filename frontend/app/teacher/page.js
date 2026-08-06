"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
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
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
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

// Compact, Premium 3D Carousel Component
function Circular3DCarousel({ actions, prefersReducedMotion }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const total = actions.length;
  const angleStep = 360 / total;

  // Orbit radius
  const [radius, setRadius] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(180);
      } else if (window.innerWidth < 1024) {
        setRadius(220);
      } else {
        setRadius(270);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => setSelectedIndex((prev) => prev + 1);
  const handlePrev = () => setSelectedIndex((prev) => prev - 1);

  // Rotation spring physics
  const currentAngle = -selectedIndex * angleStep;
  const springAngle = useSpring(currentAngle, { stiffness: 150, damping: 20 });

  useEffect(() => {
    springAngle.set(currentAngle);
  }, [currentAngle, springAngle]);

  // Drag interaction controls
  const dragStartX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const diff = endX - dragStartX.current;

    if (diff < -35) {
      handleNext();
    } else if (diff > 35) {
      handlePrev();
    }
  };

  return (
    <div className="relative w-full py-2 flex flex-col items-center select-none overflow-visible">
      {/* 3D Ring Container */}
      <div
        className="relative w-full h-[270px] sm:h-[290px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "1000px" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <motion.div
          className="relative w-[220px] sm:w-[250px] h-[210px] sm:h-[230px]"
          style={{
            transformStyle: "preserve-3d",
            rotateX: 6, // Subtle 3D tilt for depth without text distortion
            rotateY: springAngle,
          }}
        >
          {actions.map((action, index) => {
            const cardAngle = index * angleStep;
            
            // Calculate front-facing card position
            const rawDiff = (cardAngle + currentAngle) % 360;
            const normalizedDiff = (rawDiff + 540) % 360 - 180;
            const isFront = Math.abs(normalizedDiff) < 30;

            const Icon = action.icon;

            return (
              <div
                key={action.href}
                className="absolute inset-0 transition-all duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity: isFront ? 1 : Math.abs(normalizedDiff) > 90 ? 0.25 : 0.55,
                  pointerEvents: isFront ? "auto" : "none",
                  backfaceVisibility: "hidden",
                }}
              >
                <Link
                  href={action.href}
                  className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a976]"
                >
                  <motion.div
                    animate={{
                      scale: isFront ? 1.04 : 0.85,
                      y: isFront ? -4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden backdrop-blur-xl ${
                      isFront
                        ? "bg-gradient-to-br from-[#531d10]/95 via-[#3d140a]/95 to-[#2a0c06]/95 border-[#e0a976]/60 shadow-[0_15px_40px_rgba(224,169,118,0.2)]"
                        : "bg-[#331109]/90 border-[#8b4513]/40"
                    }`}
                  >
                    {/* Glossy Top Edge Highlight */}
                    {isFront && (
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e0a976]/80 to-transparent" />
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#e0a976]/20 to-[#5a1a08]/80 rounded-xl flex items-center justify-center border border-[#e0a976]/30 shadow-md">
                          <Icon className="w-5 h-5 text-[#e0a976]" />
                        </div>
                        {isFront && (
                          <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#e0a976]/15 text-[#fce4c8] border border-[#e0a976]/30">
                            <Sparkles className="w-3 h-3 text-[#e0a976]" />
                            <span>ACTIVE</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold mb-1 text-white group-hover:text-[#fce4c8] transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-300/85 text-xs leading-relaxed line-clamp-2">
                        {action.body}
                      </p>
                    </div>

                    {/* Premium CTA Button */}
                    <div className={`mt-3 w-full py-2 rounded-xl font-bold tracking-wide text-center text-xs transition-all flex items-center justify-center gap-1 shadow-md ${
                      isFront
                        ? "bg-gradient-to-r from-[#e0a976] to-[#b8763f] text-[#2a0c06] hover:brightness-110 shadow-[0_4px_15px_rgba(224,169,118,0.3)]"
                        : "bg-[#2b0d09] text-[#e0a976] border border-[#e0a976]/20"
                    }`}>
                      <span>{action.cta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Rotation Controls */}
      <div className="flex items-center gap-4 mt-1 z-10">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-full bg-[#531d10] border border-[#e0a976]/40 text-[#e0a976] hover:bg-[#6f311c] hover:scale-105 active:scale-95 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a976] cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dynamic Ring Indicators */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a0c06]/80 rounded-full border border-[#e0a976]/20 backdrop-blur-md">
          {actions.map((_, idx) => {
            const activeIdx = ((selectedIndex % total) + total) % total;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === idx ? "w-5 bg-[#e0a976]" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-2.5 rounded-full bg-[#531d10] border border-[#e0a976]/40 text-[#e0a976] hover:bg-[#6f311c] hover:scale-105 active:scale-95 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a976] cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
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
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const gridItem = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
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
          className="relative max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4"
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
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 space-y-10">
        {/* Quick Actions 3D Ring Section */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeSlideUp}
            className="flex items-center justify-between mb-1"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-[#e0a976] rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Quick Actions
              </h2>
            </div>
            <span className="text-xs text-[#e0a976]/90 flex items-center gap-1 font-semibold">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
              Drag or use arrows to rotate
            </span>
          </motion.div>

          <Circular3DCarousel
            actions={QUICK_ACTIONS}
            prefersReducedMotion={prefersReducedMotion}
          />
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