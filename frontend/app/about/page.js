"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValue,
} from "framer-motion";
import {
  Rocket,
  Trophy,
  Sparkles,
  Award,
  Users,
  BadgeCheck,
  Boxes,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Flame,
  RotateCcw,
} from "lucide-react";

/* -------------------------------------------------------------------- */
/*  Data                                                                */
/* -------------------------------------------------------------------- */

const WHY_CARDS = [
  { icon: PlayCircle, title: "Interactive Courses", body: "Structured learning with videos and resources." },
  { icon: Sparkles, title: "Smart Quizzes", body: "Practice with automatically evaluated quizzes." },
  { icon: Flame, title: "XP Rewards", body: "Earn experience points after every achievement." },
  { icon: Award, title: "Achievement Badges", body: "Unlock milestones while learning." },
  { icon: Trophy, title: "Leaderboards", body: "Compete with fellow learners." },
  { icon: BadgeCheck, title: "Certificates", body: "Receive personalized certificates after course completion." },
];

const TIMELINE = [
  "Teacher Creates Course",
  "Student Enrolls",
  "Studies Lessons",
  "Attempts Quiz",
  "Earns XP",
  "Unlocks Badges",
  "Completes Course",
  "Gets Certificate",
];

const STUDENT_FEATURES = [
  "Watch Lessons",
  "Complete Quizzes",
  "Track Progress",
  "Earn XP",
  "Unlock Badges",
  "Receive Certificates",
  "Compete on Leaderboard",
  "Review Flashcards",
];

const TEACHER_FEATURES = [
  "Create Courses",
  "Upload Lessons",
  "Create Quizzes",
  "Manage Flashcards",
  "Track Student Progress",
  "Customize Certificates",
  "Review Student Performance",
  "Monitor Enrollments",
];

const TEAM = [
  {
    name: "Mohd Aaqib",
    role: "Frontend & Backend Developer",
    avatar: "/team/aaqib.jpg",
    cutout: "/team/aaqib.png",
  },
  {
    name: "Abida Argawan",
    role: "UI/UX & Backend Developer",
    avatar: "/team/abida.jpg",
    cutout: "/team/abida.png",
  },
];

const FAQS = [
  {
    q: "What is GLP?",
    a: "GLP (Gamified Learning Platform) is an interactive e-learning platform...",
  },
  {
    q: "Who can use this platform?",
    a: "The platform supports both students and instructors...",
  },
  {
    q: "How do students enroll in a course?",
    a: "Students can browse available courses...",
  },
  {
    q: "How do students earn XP?",
    a: "XP is awarded for completing lessons...",
  },
  {
    q: "How does progress tracking work?",
    a: "The platform automatically tracks lesson completion...",
  },
  {
    q: "How do leaderboards work?",
    a: "Leaderboards rank students according to XP earned...",
  },
  {
    q: "Can teachers monitor student performance?",
    a: "Yes. Instructors can view enrolled students...",
  },
  {
    q: "Does the platform support flashcards?",
    a: "Yes. Flashcards help students revise important concepts...",
  },
  {
    q: "Is learning progress saved automatically?",
    a: "Yes. Every completed lesson, quiz, XP and badge is saved automatically.",
  },
  {
    q: "Why was this platform developed?",
    a: "This Gamified Learning Platform was developed as part of a software engineering internship to demonstrate a modern full-stack LMS enhanced with gamification.",
  },
  {
    q: "Which skills were demonstrated in this internship?",
    a: "The project demonstrates full-stack development, REST APIs, authentication, dashboards, role-based access control, database design, progress tracking and responsive UI.",
  },
  {
    q: "What technologies were used in this internship project?",
    a: "The platform was built using Next.js, React, Tailwind CSS, NestJS, PostgreSQL, TypeORM and JWT Authentication.",
  },
];

/* -------------------------------------------------------------------- */
/*  Primitives & Helpers                                                */
/* -------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

function Reveal({ children, className = "", from = "up", delay = 0 }) {
  const reduce = useReducedMotion();
  const variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: {
          opacity: 0,
          y: from === "up" ? 30 : from === "down" ? -30 : 0,
          x: from === "left" ? -36 : from === "right" ? 36 : 0,
        },
        show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Isolated level badge to prevent top-level scroll re-renders */
function ScrollLevelBadge({ scrollYProgress }) {
  const level = useTransform(scrollYProgress, (v) => Math.min(15, Math.max(1, Math.floor(v * 15) + 1)));
  const [levelDisplay, setLevelDisplay] = useState(1);

  useEffect(() => {
    return level.on("change", (v) => setLevelDisplay(v));
  }, [level]);

  return (
    <div className="absolute right-3 top-2.5 hidden items-center gap-1 rounded-full bg-[#3B1410] px-2.5 py-1 text-[11px] font-heading font-bold text-white sm:flex">
      <Flame size={11} className="text-[#E3A860]" /> Lv {levelDisplay}
    </div>
  );
}

function Button({ children, tone = "light", variant = "solid", className = "", ...props }) {
  const reduce = useReducedMotion();
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold font-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  let styles = "";
  if (tone === "dark" && variant === "solid") {
    styles =
      "bg-gradient-to-br from-[#F0C285] via-[#E3A860] to-[#B5702F] text-[#2B0F0B] shadow-[0_8px_24px_-8px_rgba(227,168,96,0.55)] hover:brightness-105 focus-visible:ring-[#E3A860] focus-visible:ring-offset-[#240D08]";
  } else if (tone === "dark" && variant === "ghost") {
    styles =
      "border border-white/20 bg-white/5 text-white hover:border-[#E3A860]/60 focus-visible:ring-[#E3A860] focus-visible:ring-offset-[#240D08]";
  } else if (variant === "solid") {
    styles =
      "bg-[#5C2418] text-[#FBF5EF] hover:bg-[#4A1B14] focus-visible:ring-[#5C2418] focus-visible:ring-offset-[#FBF5EF]";
  } else {
    styles =
      "border border-[#5C2418]/25 text-[#5C2418] hover:bg-[#5C2418]/5 focus-visible:ring-[#5C2418] focus-visible:ring-offset-[#FBF5EF]";
  }
  return (
    <motion.button
      className={`${base} ${styles} ${className}`}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function Pill({ icon: Icon, children, tone = "light" }) {
  const styles =
    tone === "dark"
      ? "border border-[#E3A860]/35 bg-white/5 text-[#F3D9B1]"
      : "bg-[#F7E4D0] text-[#5C2418] border border-[#5C2418]/10";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold font-body ${styles}`}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}

function SectionHead({ eyebrow, title, tone = "light", center = true }) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className={`inline-flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="h-7 w-[5px] rounded-full bg-gradient-to-b from-[#F3C27A] via-[#E3A860] to-[#6B2A1F]" />
        <span
          className={`font-heading text-lg sm:text-xl font-bold uppercase tracking-[0.22em] ${
            tone === "dark" ? "text-[#F0C285]" : "text-[#B5702F]"
          }`}
        >
          {eyebrow}
        </span>
      </div>

      {title && (
        <h2
          className={`font-heading mt-5 text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight ${
            tone === "dark" ? "text-white" : "text-[#2B160E]"
          }`}
        >
          {title}
        </h2>
      )}
    </div>
  );
}

function ParticleField({ count = 8 }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const dots = Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + 8) % 100,
    top: (i * 53 + 12) % 100,
    size: 3 + (i % 3) * 2,
    delay: (i % 5) * 0.6,
    duration: 5 + (i % 4),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#E3A860]/40 blur-[1px] transform-gpu"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -16, 0], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DarkPanel({ children, className = "" }) {
  return (
    <section
      className={`relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16 ${className}`}
      style={{ background: "radial-gradient(120% 100% at 20% 0%, #4A1B14 0%, #2B0F08 55%, #240D08 100%)" }}
    >
      <ParticleField />
      <div className="relative">{children}</div>
    </section>
  );
}

function Medallion({ icon: Icon, size = 64, tone = "dark" }) {
  const ring = tone === "dark" ? "from-[#F0C285] to-[#6B2A1F]" : "from-[#E3A860] to-[#B5702F]";
  const inner = tone === "dark" ? "#3B1410" : "#FBF5EF";
  const iconColor = tone === "dark" ? "#F3D9B1" : "#6B2A1F";
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <div className={`h-full w-full rounded-full bg-gradient-to-br ${ring} p-[2.5px]`}>
        <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: inner }}>
          <Icon size={size * 0.42} color={iconColor} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Carousel 3D Component                                                */
/* -------------------------------------------------------------------- */

function Carousel3D({ items }) {
  const [active, setActive] = useState(0);
  const [radius, setRadius] = useState(230);
  const reduce = useReducedMotion();
  const dragStartX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const total = items.length;
  const angleStep = total ? 360 / total : 0;

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setRadius(130);
      else if (window.innerWidth < 1024) setRadius(180);
      else setRadius(230);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir) => setActive((a) => a + dir);

  const currentAngle = -active * angleStep;
  const springAngle = useSpring(currentAngle, { stiffness: 150, damping: 20 });

  useEffect(() => {
    springAngle.set(currentAngle);
  }, [currentAngle, springAngle]);

  const handlePointerDown = (e) => {
    if (reduce) return;
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handlePointerUp = (e) => {
    if (!isDragging || reduce) return;
    setIsDragging(false);
    const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const diff = endX - dragStartX.current;

    if (diff < -35) go(1);
    else if (diff > 35) go(-1);
  };

  return (
    <div className="mx-auto max-w-4xl select-none">
      <div
        className="relative flex h-[300px] items-center justify-center sm:h-[340px] cursor-grab active:cursor-grabbing"
        style={{ perspective: 1000 }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <motion.div
          className="relative w-64 h-[220px] sm:w-72 sm:h-[240px] transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            rotateX: reduce ? 0 : 6,
            rotateY: reduce ? 0 : springAngle,
          }}
        >
          {items.map(({ icon: Icon, title, body }, i) => {
            const cardAngle = i * angleStep;
            const rawDiff = (cardAngle + currentAngle) % 360;
            const normalizedDiff = ((rawDiff + 540) % 360) - 180;
            const isActive = Math.abs(normalizedDiff) < 30;

            return (
              <div
                key={title}
                className="absolute inset-0 transition-all duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  transform: reduce ? undefined : `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity: reduce
                    ? isActive ? 1 : 0.35
                    : isActive ? 1 : Math.abs(normalizedDiff) > 90 ? 0.25 : 0.55,
                  pointerEvents: isActive ? "auto" : "none",
                  backfaceVisibility: "hidden",
                }}
              >
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.85, y: isActive ? -4 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                    {isActive && <Pill icon={Sparkles} tone="dark">Core Feature</Pill>}
                    <div className="mt-4 flex justify-center">
                      <Medallion icon={Icon} size={56} tone="dark" />
                    </div>
                    <h3 className="font-heading mt-4 text-lg font-bold text-white">{title}</h3>
                    <p className="mt-1.5 text-sm text-white/60">{body}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <motion.button
          onClick={() => go(-1)}
          whileHover={reduce ? undefined : { scale: 1.08 }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A860]"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </motion.button>

        <div className="flex items-center gap-1.5">
          {items.map((item, i) => {
            const activeIdx = ((active % total) + total) % total;
            return (
              <button
                key={item.title}
                onClick={() => setActive(i)}
                aria-label={`Go to ${item.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIdx ? "w-6 bg-gradient-to-r from-[#E3A860] to-[#6B2A1F]" : "w-1.5 bg-white/20"
                }`}
              />
            );
          })}
        </div>

        <motion.button
          onClick={() => go(1)}
          whileHover={reduce ? undefined : { scale: 1.08 }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A860]"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/40 font-body">
        <RotateCcw size={12} /> Drag or use arrows to rotate
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Main Page Component                                                 */
/* -------------------------------------------------------------------- */

export default function AboutPage() {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const xpWidth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div ref={containerRef} className="font-body" style={{ background: "#FBF5EF", color: "#2B160E" }}>
      {/* Top oxblood strip */}
      <div className="h-1.5 w-full bg-[#5C2418]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2B160E]/8 bg-[#FBF5EF]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="font-heading text-xl font-extrabold text-[#6B2A1F]">
            GLP
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-semibold items-center">
            <motion.div whileHover={{ y: -3 }}>
              <Link href="/about" className="relative text-[#6B2A1F] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-[#8b4513]">
                About us
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <Link href="/courses" className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#8b4513] after:transition-all after:duration-300 hover:after:w-full hover:text-[#8b4513]">
                Courses
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <Link href="/leaderboard" className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#8b4513] after:transition-all after:duration-300 hover:after:w-full hover:text-[#8b4513]">
                Leaderboards
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3 }}>
              <Link href="#contact" className="relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#8b4513] after:transition-all after:duration-300 hover:after:w-full hover:text-[#8b4513]">
                Contact us
              </Link>
            </motion.div>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hidden !px-4 !py-2 sm:inline-flex">
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button variant="solid" className="!px-4 !py-2">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* XP scroll bar & Level indicator */}
        <div className="relative h-1.5 w-full bg-[#F1E4D8]">
          <motion.div className="h-full origin-left bg-gradient-to-r from-[#E3A860] to-[#6B2A1F]" style={{ scaleX: xpWidth }} />
          <ScrollLevelBadge scrollYProgress={scrollYProgress} />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:px-10 sm:pt-20 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={staggerParent}>
            <motion.div variants={fadeUp}>
              <Pill icon={Sparkles}>About · Gamified Learning Platform</Pill>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Making learning
              <br />
              <span className="bg-gradient-to-r from-[#E3A860] to-[#6B2A1F] bg-clip-text text-transparent">interactive</span>,
              rewarding
              <br />
              and fun.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-[#7A6A5F] sm:text-lg">
              GLP is a modern educational platform built to improve student engagement — XP points, achievements, quizzes, and leaderboards, all in one motivating environment.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button><Rocket size={16} /> Explore Courses</Button>
              <Button variant="ghost"><Trophy size={16} /> View Leaderboard</Button>
            </motion.div>
          </motion.div>

          {/* Steady & Larger Hero Image Showcase */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-2xl">
            <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3A860]/25 via-[#6B2A1F]/10 to-transparent opacity-80" />

            <div className="relative overflow-hidden rounded-2xl border border-[#2B160E]/10 bg-white p-2 shadow-2xl">
              <Image
                src="/images/hero-platform.png"
                alt="GLP Landing Page Showcase"
                width={1200}
                height={750}
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="w-full rounded-xl object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* OUR STORY */}
      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal from="left">
            <SectionHead eyebrow="Our Story" title="Learning that keeps its promise to stay interesting." center={false} />
            <p className="mt-5 text-[#7A6A5F] leading-relaxed">
              Traditional online learning often becomes repetitive and lacks motivation. GLP was built to address that directly — combining structured educational content with game-inspired mechanics. Students stay motivated through rewards, while teachers manage courses, track progress, and evaluate performance with ease.
            </p>
          </Reveal>
          <Reveal from="right" delay={0.1}>
            {/* Steady & Larger Story Showcase */}
            <div className="relative mx-auto h-[360px] w-full max-w-lg sm:h-[420px]">
              <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3A860]/20 via-[#6B2A1F]/10 to-transparent" />

              <div className="absolute left-0 top-0 w-[82%] -rotate-6 rounded-2xl border border-[#2B160E]/10 bg-white p-1.5 shadow-[0_35px_80px_rgba(0,0,0,0.18)] transition-transform hover:-rotate-3 duration-300">
                <Image
                  src="/images/student-dashboard.png"
                  alt="Student Dashboard"
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="w-full rounded-xl object-cover"
                />
              </div>

              <div className="absolute bottom-2 right-0 w-[82%] rounded-2xl border border-[#2B160E]/10 bg-white p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300 z-10">
                <Image
                  src="/images/teacher-dashboard.png"
                  alt="Teacher Dashboard"
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* MISSION & VISION */}
      <DarkPanel className="!pb-12">
        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerParent}
        >
          {[
            { title: "Mission", icon: Rocket, body: "To make learning engaging, interactive, and rewarding through modern gamification techniques." },
            { title: "Vision", icon: Sparkles, body: "To become a comprehensive digital learning ecosystem where students enjoy learning and teachers can easily create, manage, and evaluate educational content." },
          ].map(({ title, icon, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -6 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(227,168,96,0.4)] transform-gpu"
            >
              <Medallion icon={icon} size={52} tone="dark" />
              <h3 className="font-heading mt-4 text-2xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-white/65 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </DarkPanel>

      {/* WHY CHOOSE GLP */}
      <DarkPanel className="!pt-12">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHead eyebrow="Why Choose GLP" title="Built for the way students actually stay motivated." tone="dark" />
        </Reveal>
        <div className="mt-14">
          <Carousel3D items={WHY_CARDS} />
        </div>
      </DarkPanel>

      {/* HOW GLP WORKS */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHead eyebrow="How GLP Works" title="From enrolling to certificate, in one flow." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute left-[15px] top-0 h-full w-px bg-[#2B160E]/10" />
            <motion.div
              className="absolute left-[15px] top-0 w-px origin-top bg-gradient-to-b from-[#E3A860] to-[#6B2A1F]"
              style={{ height: "100%" }}
              initial={reduce ? undefined : { scaleY: 0 }}
              whileInView={reduce ? undefined : { scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <ul className="space-y-8">
              {TIMELINE.map((step, i) => (
                <Reveal key={step} from="left" delay={i * 0.04} className="relative flex items-center gap-5">
                  <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#E3A860] to-[#6B2A1F] font-heading text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal from="right">
            {/* Steady & Larger How It Works Showcase */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-xl pt-6">
              <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3A860]/20 via-[#6B2A1F]/10 to-transparent" />
              <div className="overflow-hidden rounded-2xl border border-[#2B160E]/10 bg-white p-2 shadow-2xl">
                <Image
                  src="/images/leaderboard.png"
                  alt="Leaderboard"
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full rounded-xl object-cover"
                />
              </div>

              <div className="absolute -top-3 -left-4 w-[52%] sm:w-[48%] rounded-xl border border-[#2B160E]/10 bg-white p-1.5 shadow-2xl z-10">
                <Image
                  src="/images/flashcards.png"
                  alt="Flashcards"
                  width={500}
                  height={320}
                  sizes="(max-width: 768px) 60vw, 300px"
                  className="w-full rounded-md object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* FEATURES FOR STUDENTS */}
      <section className="px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal from="left">
            {/* Steady & Larger Student Features Showcase */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3A860]/20 via-[#6B2A1F]/10 to-transparent" />
              <div className="overflow-hidden rounded-2xl border border-[#2B160E]/10 bg-white p-2 shadow-[0_35px_80px_rgba(0,0,0,0.18)]">
                <Image
                  src="/images/explore-courses.png"
                  alt="Explore Courses"
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full rounded-xl object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 w-[52%] sm:w-[48%] rounded-xl border border-[#2B160E]/10 bg-white p-1.5 shadow-2xl z-10">
                <Image
                  src="/images/lesson-view.png"
                  alt="Lesson View"
                  width={500}
                  height={320}
                  sizes="(max-width: 768px) 60vw, 300px"
                  className="w-full rounded-md object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHead eyebrow="Features for Students" title="" center={false} />
            <motion.ul className="mt-2 space-y-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={staggerParent}>
              {STUDENT_FEATURES.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { x: 6 }}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-[#2B160E]/8 hover:bg-white"
                >
                  <BadgeCheck size={16} className="flex-none text-[#6B2A1F]" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FEATURES FOR TEACHERS */}
      <section className="px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHead eyebrow="Features for Teachers" title="" center={false} />
            <motion.ul className="mt-2 space-y-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={staggerParent}>
              {TEACHER_FEATURES.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { x: 6 }}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-[#2B160E]/8 hover:bg-white"
                >
                  <BadgeCheck size={16} className="flex-none text-[#6B2A1F]" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <Reveal from="right" className="order-1 lg:order-2">
            {/* Steady & Larger Teacher Features Showcase */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E3A860]/20 via-[#6B2A1F]/10 to-transparent" />
              <div className="overflow-hidden rounded-2xl border border-[#2B160E]/10 bg-white p-2 shadow-[0_35px_80px_rgba(0,0,0,0.18)]">
                <Image
                  src="/images/teacher-dashboard.png"
                  alt="Teacher Dashboard"
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full rounded-xl object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 w-[52%] sm:w-[48%] rounded-xl border border-[#2B160E]/10 bg-white p-1.5 shadow-2xl z-10">
                <Image
                  src="/images/quiz-results.png"
                  alt="Quiz Results"
                  width={500}
                  height={320}
                  sizes="(max-width: 768px) 60vw, 300px"
                  className="w-full rounded-md object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* MEET THE TEAM */}
      <DarkPanel>
        <Reveal className="mx-auto max-w-2xl">
          <SectionHead eyebrow="Meet the Team" title="The people behind GLP." tone="dark" />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
          {TEAM.map((member) => (
            <TeamCard key={member.name} {...member} reduce={reduce} />
          ))}
        </div>
      </DarkPanel>

      {/* INTERNSHIP DETAILS */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-2xl rounded-3xl border border-[#2B160E]/8 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto"><Medallion icon={Boxes} size={56} tone="light" /></div>
          <h3 className="font-heading mt-4 text-2xl font-bold">Internship Project</h3>
          <p className="mt-3 text-[#7A6A5F] leading-relaxed">
            Gamified Learning Platform was developed as part of an internship project to demonstrate the practical implementation of modern web technologies, educational gamification concepts, and full-stack software development.
          </p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={15} className="flex-none text-[#6B2A1F]" />
              <span><span className="block text-xs text-[#7A6A5F]">Institution</span>Jamia Millia Islamia</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap size={15} className="flex-none text-[#6B2A1F]" />
              <span><span className="block text-xs text-[#7A6A5F]">Department</span>Computer Engineering</span>
            </div>
          </div>
        </Reveal>
      </section>

      <SectionDivider />

      {/* SUPERVISOR */}
      <section className="px-6 py-8 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-xl rounded-3xl border border-[#2B160E]/8 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8B4513]">
              Under the Supervision of
            </p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-[#2B160E]">
              Project Supervisor
            </h2>
            <p className="mt-2 text-[#7A6A5F]">
              This internship project was developed under the guidance of our academic supervisor.
            </p>
          </div>

          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[#E3A860]">
            <Image
              src="/team/sameer.jpg"
              alt="Dr. Sameer Babu M"
              width={128}
              height={128}
              sizes="128px"
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="font-heading mt-4 text-2xl font-bold">Dr. Sameer Babu M</h3>
          <p className="mt-1 text-sm text-[#7A6A5F]">Associate Professor (Educational Administration)</p>
          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 text-left text-sm">
            <InfoRow icon={GraduationCap} text="Department of Educational Studies" />
            <InfoRow icon={Building2} text="Jamia Millia Islamia (Central University)" />
            <InfoRow icon={MapPin} text="New Delhi – 110025" />
            <InfoRow icon={Mail} text="msameer@jmi.ac.in" />
            <InfoRow icon={Mail} text="sameerbabuxyz@gmail.com" />
            <InfoRow icon={Phone} text="+91 9447943244" />
          </div>
        </Reveal>
      </section>

      <SectionDivider />

      {/* CONTACT */}
      <section className="px-6 py-20 sm:px-10 lg:px-16" id="contact">
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-16">
            <SectionHead eyebrow="Contact" title="Get in touch." />
          </div>
        </Reveal>
        <motion.div
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerParent}
        >
          {[
            { icon: Mail, label: "Email" },
            { icon: Phone, label: "Phone" },
            { icon: Building2, label: "GitHub" },
            { icon: Users, label: "LinkedIn" },
            { icon: MapPin, label: "Location" },
          ].map(({ icon: Icon, label }) => (
            <motion.a
              href="#"
              key={label}
              variants={fadeUp}
              whileHover={reduce ? undefined : { y: -4 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#2B160E]/8 bg-white py-6 text-sm font-semibold shadow-sm transition-colors hover:border-[#E3A860]/60 hover:text-[#6B2A1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2A1F] focus-visible:ring-offset-2"
            >
              <Icon size={18} />
              {label}
            </motion.a>
          ))}
        </motion.div>
      </section>

      <SectionDivider />

      {/* FAQ */}
      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHead eyebrow="FAQ" title="Common questions." />
        </Reveal>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-[#2B160E]/8 rounded-2xl border border-[#2B160E]/8 bg-white shadow-sm">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6B2A1F]"
                >
                  {item.q}
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={18} className="flex-none text-[#6B2A1F]" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-[#7A6A5F]">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      <footer className="border-t border-[#2B160E]/8 px-6 py-10 text-center text-xs text-[#7A6A5F] sm:px-10">
        © {new Date().getFullYear()} Gamified Learning Platform. Built as an internship project.
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Optimized Team Card Component                                       */
/* -------------------------------------------------------------------- */

function TeamCard({ name, role, avatar, cutout, reduce }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(x, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 200, damping: 25 });

  function handleMouseMove(e) {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(py * -8);
    y.set(px * 8);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative rounded-3xl border border-white/10 bg-white/[0.06] pt-10 pb-7 px-7 text-center transform-gpu"
    >
      <div className="relative mx-auto h-40 w-40">
        <div className="absolute bottom-0 left-1/2 z-20 h-40 w-40 -translate-x-1/2 overflow-hidden rounded-full border-[6px] border-[#E3A860] bg-gradient-to-br from-[#6B2A1F] via-[#4B2115] to-[#2B160E] shadow-[0_15px_35px_rgba(0,0,0,0.35)] before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle,rgba(227,168,96,0.18)_0%,transparent_70%)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:border-[#FFD27D] group-hover:shadow-[0_0_70px_rgba(227,168,96,0.9)]">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="160px"
            className="object-cover transition-all duration-300 group-hover:opacity-0"
          />
        </div>

        <Image
          src={cutout}
          alt={name}
          width={260}
          height={260}
          sizes="220px"
          className="absolute bottom-0 left-1/2 z-30 w-[220px] -translate-x-1/2 opacity-0 translate-y-8 scale-50 object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-[1.7] group-hover:-translate-y-14 pointer-events-none"
        />
      </div>

      <h3 className="font-heading mt-4 text-xl font-bold text-white">{name}</h3>
      <p className="mt-1 text-sm text-white/55">{role}</p>
      <div className="mt-4 flex justify-center gap-3">
        {[Mail, Phone].map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={reduce ? undefined : { y: -3 }}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            className="rounded-full border border-white/15 p-2 text-[#F3D9B1] transition-colors hover:border-[#E3A860] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A860]"
          >
            <Icon size={15} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="flex-none text-[#6B2A1F]" />
      <span className="break-all">{text}</span>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex justify-center py-12">
      <div className="flex items-center gap-4">
        <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#E3A860]/60" />
        <div className="h-3 w-3 rounded-full bg-[#E3A860]" />
        <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#E3A860]/60" />
      </div>
    </div>
  );
}