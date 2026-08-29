"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FolderOpen,
  Link as LinkIcon,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { API_URL } from "@/lib/api";
import lessonService from "../../../services/lessonService";

const GUIDANCE = [
  {
    icon: FolderOpen,
    number: "1",
    title: "Create a Google Drive folder",
    body: "Create a folder in Google Drive using the same name as your course. Keep all lesson resources inside this folder.",
  },
  {
    icon: LinkIcon,
    number: "2",
    title: "Allow access by link",
    body: 'Open the folder sharing settings and select "Anyone with the link" with Viewer access.',
  },
  {
    icon: Video,
    number: "3",
    title: "Add your videos and materials",
    body: "Put lecture videos, PDFs, worksheets, notes, and other course resources inside the Drive folder.",
  },
  {
    icon: CheckCircle2,
    number: "4",
    title: "Paste the required links",
    body: "Copy the shareable link for the lecture video and reference material, then paste them into the fields below.",
  },
];

// Lightweight check so the "test link" button only appears for something
// that could plausibly be opened — not full validation, just a sanity gate.
const isValidUrl = (value) => {
  if (!value || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function CreateLesson() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const loadCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(
        `${API_URL}/courses/teacher/${user.id}`
      );

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setCourses([]);
      setErrorMessage(
        "Unable to load your courses. Please refresh the page and try again."
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  const steps = useMemo(
    () => [
      { label: "Course", done: Boolean(courseId) },
      { label: "Title", done: title.trim().length > 0 },
      { label: "Notes", done: content.trim().length > 0 },
      { label: "Video", done: videoUrl.trim().length > 0 },
      { label: "Reference", done: pdfUrl.trim().length > 0 },
    ],
    [courseId, title, content, videoUrl, pdfUrl]
  );

  const doneCount = steps.filter((step) => step.done).length;
  const progressPct = Math.round((doneCount / steps.length) * 100);

  // Reflects the selected course in the Drive-structure example so the
  // guidance stays concrete instead of a generic placeholder.
  const selectedCourseTitle = useMemo(
    () => courses.find((c) => String(c.id) === String(courseId))?.title,
    [courses, courseId]
  );
  const folderExampleName = selectedCourseTitle || "Your Course Name";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await lessonService.createLesson({
        title,
        content,
        videoUrl,
        pdfUrl,
        courseId: Number(courseId),
        teacherId: user.id,
      });

      setSuccessMessage("Lesson Created Successfully");

      setTitle("");
      setContent("");
      setVideoUrl("");
      setPdfUrl("");
    } catch (err) {
      setErrorMessage(
        "Something went wrong publishing this lesson. Please check your links and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fadeSlideUp = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const guidanceContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
      },
    },
  };

  const guidanceItem = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="min-h-screen text-gray-800 font-sans"
      style={{
        backgroundColor: "#f5f0eb",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(139,69,19,0.09) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* TOP STRIP */}
      <div className="h-2 bg-gradient-to-r from-[#6b1f0f] via-[#8b4513] to-[#6b1f0f]" />

      {/* COMPACT HEADER */}
      <header className="relative bg-[#3b130d] overflow-hidden">
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-0 w-72 h-72 bg-[#8b4513]/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-[#a0522d]/10 blur-[90px] rounded-full" />
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlideUp}
          className="
            relative
            max-w-6xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            md:py-7
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >
          <div className="min-w-0">
            <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#e0a976] mb-1.5">
              Course Builder
            </span>

            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-black
                tracking-tight
                text-white
                leading-tight
              "
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Add New Lesson
            </h1>

            <p className="text-[#d8c3b3] mt-1.5 text-xs sm:text-sm max-w-xl">
              Prepare your Google Drive resources, add the lesson details,
              and connect the required links.
            </p>
          </div>

          <Link
            href="/teacher"
            className="self-start sm:self-center shrink-0"
          >
            <motion.button
              type="button"
              whileHover={
                prefersReducedMotion ? undefined : { scale: 1.03 }
              }
              whileTap={
                prefersReducedMotion ? undefined : { scale: 0.97 }
              }
              className="
                px-4
                py-2
                bg-white/5
                hover:bg-white/10
                text-white
                rounded-xl
                text-xs
                sm:text-sm
                font-semibold
                shadow
                border
                border-white/15
                backdrop-blur-sm
                transition-colors
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#e0a976]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#3b130d]
              "
            >
              ← Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 items-start">

          {/* =========================================================
              LEFT: TEACHER GUIDANCE
          ========================================================= */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeSlideUp}
            className="lg:col-span-2"
          >
            {/* Section heading */}
            <div className="border-l-4 border-[#8b4513] pl-4 mb-4">
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-bold
                  text-[#3b130d]
                  leading-tight
                "
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Lesson Assembly
              </h2>

              <p className="text-gray-700 mt-1.5 leading-relaxed text-xs sm:text-sm">
                Follow these steps before publishing a lesson so that
                students can access every resource without permission issues.
              </p>
            </div>

            {/* GOOGLE DRIVE GUIDE */}
            <div className="bg-white rounded-2xl shadow-lg shadow-[#3b130d]/5 border border-[#e7d8cc] overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-[#f0e6da]">
                <div className="flex items-center gap-2">
                  <span
                    className="
                      w-8
                      h-8
                      rounded-lg
                      bg-[#f5f0eb]
                      border
                      border-[#e7d8cc]
                      flex
                      items-center
                      justify-center
                      text-base
                    "
                  >
                    📁
                  </span>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                      Google Drive Setup
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Complete these steps before adding your links.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={guidanceContainer}
                className="divide-y divide-[#f0e6da]"
              >
                {GUIDANCE.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.number}
                      variants={guidanceItem}
                      className="
                        flex
                        items-start
                        gap-3
                        px-4
                        sm:px-5
                        py-3
                      "
                    >
                      <div
                        className="
                          shrink-0
                          w-8
                          h-8
                          rounded-lg
                          bg-[#f5f0eb]
                          border
                          border-[#e7d8cc]
                          flex
                          items-center
                          justify-center
                          relative
                        "
                      >
                        <Icon
                          size={15}
                          className="text-[#8b4513]"
                        />

                        <span
                          className="
                            absolute
                            -top-1.5
                            -right-1.5
                            w-4
                            h-4
                            rounded-full
                            bg-[#8b4513]
                            text-white
                            text-[9px]
                            font-bold
                            flex
                            items-center
                            justify-center
                            border
                            border-white
                          "
                        >
                          {item.number}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#3b130d]">
                          {item.title}
                        </h4>

                        <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* IMPORTANT WARNING */}
            <div
              className="
                mt-4
                rounded-xl
                border
                border-[#e6b8ae]
                bg-[#fbecea]
                px-4
                py-3
              "
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  size={17}
                  className="text-[#8a2e1f] shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-xs font-bold text-[#8a2e1f]">
                    Before You Publish
                  </p>

                  <p className="text-[11px] text-[#8a2e1f]/80 mt-1 leading-relaxed">
                    Make sure the Google Drive folder and every shared
                    resource are accessible using the link. Students should
                    not see a "Request access" message.
                  </p>
                </div>
              </div>
            </div>

            {/* FOLDER EXAMPLE */}
            <div className="mt-4 bg-white rounded-xl border border-[#e7d8cc] px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen
                  size={16}
                  className="text-[#8b4513]"
                />

                <p className="text-xs font-bold text-[#3b130d]">
                  Recommended Drive Structure
                </p>
              </div>

              <div
                className="
                  bg-[#f5f0eb]/70
                  rounded-lg
                  border
                  border-[#e7d8cc]
                  px-3
                  py-2
                  font-mono
                  text-[10px]
                  sm:text-[11px]
                  text-gray-700
                  leading-relaxed
                "
              >
                <div>📁 {folderExampleName}</div>
                <div className="pl-4">├── 🎥 Lecture 1</div>
                <div className="pl-4">├── 🎥 Lecture 2</div>
                <div className="pl-4">├── 📄 Lesson Material</div>
                <div className="pl-4">└── 📄 Worksheet.pdf</div>
              </div>
            </div>
          </motion.section>

          {/* =========================================================
              RIGHT: LESSON FORM
          ========================================================= */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeSlideUp}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.08,
            }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-[#3b130d]/10 border border-[#e7d8cc] overflow-hidden">

              {/* FORM HEADER */}
              <div className="bg-[#6f311c] px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      Lesson Information
                    </h2>

                    <p className="text-[#e3c4ac] text-[11px] mt-0.5">
                      Add the details and resource links for this lesson.
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xl sm:text-2xl font-black text-white leading-none">
                      {doneCount}
                      <span className="text-sm font-semibold text-[#e3c4ac]">
                        /{steps.length}
                      </span>
                    </p>

                    <p className="text-[9px] uppercase tracking-widest text-[#e3c4ac] mt-0.5">
                      Complete
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-3 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#cd853f] to-[#e0a976] rounded-full"
                    animate={{
                      width: `${progressPct}%`,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {steps.map((step) => (
                    <span
                      key={step.label}
                      className={`text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 ${
                        step.done
                          ? "text-[#f3d9bd]"
                          : "text-white/35"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          step.done
                            ? "bg-[#e0a976]"
                            : "bg-white/25"
                        }`}
                      />

                      {step.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* SUCCESS / ERROR */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="mx-4 sm:mx-6 mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#c7dfc0] bg-[#eef6ea] px-3 py-2 text-xs text-[#2f5c22]">
                      <span className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={14} />
                        {successMessage}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSuccessMessage("")}
                        className="text-[#2f5c22]/60 hover:text-[#2f5c22] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5c22]/40"
                        aria-label="Dismiss success message"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="overflow-hidden"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="mx-4 sm:mx-6 mt-3 flex items-start justify-between gap-3 rounded-lg border border-[#e6b8ae] bg-[#fbecea] px-3 py-2 text-xs text-[#8a2e1f]">
                      <span className="flex items-start gap-2 font-semibold">
                        <AlertCircle
                          size={14}
                          className="mt-0.5 shrink-0"
                        />
                        {errorMessage}
                      </span>

                      <button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        className="text-[#8a2e1f]/60 hover:text-[#8a2e1f] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2e1f]/40"
                        aria-label="Dismiss error message"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-3.5"
              >
                {/* COURSE */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="course-select"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#6f311c]"
                  >
                    1. Select Course
                  </label>

                  {coursesLoading ? (
                    <div className="h-10 w-full rounded-lg bg-[#f5f0eb] border border-[#e7d8cc] animate-pulse" />
                  ) : (
                    <select
                      id="course-select"
                      required
                      className="
                        w-full
                        bg-[#f5f0eb]/50
                        border
                        border-[#e7d8cc]
                        rounded-lg
                        px-3
                        py-2.5
                        text-xs
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#8b4513]/20
                        focus:border-[#8b4513]
                        focus:bg-white
                        focus-visible:ring-[#8b4513]
                        transition-all
                        text-black
                        cursor-pointer
                        disabled:opacity-50
                      "
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      disabled={courses.length === 0}
                    >
                      <option value="">
                        {courses.length === 0
                          ? "-- No courses available --"
                          : "-- Select Parent Course --"}
                      </option>

                      {courses.map((course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                  )}

                  {!coursesLoading && courses.length === 0 && (
                    <p className="text-[10px] text-[#8a2e1f] flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} className="shrink-0" />
                      You need at least one course before you can add a lesson.
                    </p>
                  )}
                </div>

                {/* LESSON TITLE */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="lesson-title"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#6f311c]"
                  >
                    2. Lesson Title
                  </label>

                  <input
                    id="lesson-title"
                    type="text"
                    required
                    placeholder="e.g., Introduction to Computer Networks"
                    className="
                      w-full
                      bg-[#f5f0eb]/50
                      border
                      border-[#e7d8cc]
                      rounded-lg
                      px-3
                      py-2.5
                      text-xs
                      placeholder-gray-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#8b4513]/20
                      focus:border-[#8b4513]
                      focus:bg-white
                      focus-visible:ring-[#8b4513]
                      transition-all
                      text-black
                    "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="lesson-content"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#6f311c]"
                    >
                      3. Lesson Notes & Content
                    </label>

                    <span className="text-[9px] text-gray-400">
                      Keep it clear and concise
                    </span>
                  </div>

                  <textarea
                    id="lesson-content"
                    required
                    rows={3}
                    placeholder="Add lesson explanation, key points, definitions, or notes..."
                    className="
                      w-full
                      bg-[#f5f0eb]/50
                      border
                      border-[#e7d8cc]
                      rounded-lg
                      px-3
                      py-2.5
                      text-xs
                      placeholder-gray-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#8b4513]/20
                      focus:border-[#8b4513]
                      focus:bg-white
                      focus-visible:ring-[#8b4513]
                      transition-all
                      text-black
                      resize-none
                    "
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* LINK INFORMATION BOX */}
                <div className="rounded-lg border border-[#e7d8cc] bg-[#f5f0eb]/60 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <LinkIcon
                      size={14}
                      className="text-[#8b4513] mt-0.5 shrink-0"
                    />

                    <p className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed">
                      <span className="font-bold text-[#3b130d]">
                        Link access:
                      </span>{" "}
                      Use shareable links from your Google Drive resources.
                      Make sure the resource is set to{" "}
                      <span className="font-semibold text-[#6f311c]">
                        Anyone with the link → Viewer
                      </span>
                      .
                    </p>
                  </div>
                </div>

                {/* VIDEO URL */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="video-url"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#6f311c]"
                  >
                    4. Lecture Video — Open via Link
                  </label>

                  <div className="relative">
                    <Video
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-[#8b4513]
                        pointer-events-none
                      "
                    />

                    <input
                      id="video-url"
                      type="url"
                      placeholder="Paste the shareable lecture video link"
                      className="
                        w-full
                        bg-[#f5f0eb]/50
                        border
                        border-[#e7d8cc]
                        rounded-lg
                        pl-9
                        pr-9
                        py-2.5
                        text-xs
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#8b4513]/20
                        focus:border-[#8b4513]
                        focus:bg-white
                        focus-visible:ring-[#8b4513]
                        transition-all
                        text-black
                      "
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />

                    {isValidUrl(videoUrl) && (
                      <a
                        href={videoUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open video link in a new tab to test it"
                        title="Test this link"
                        className="
                          absolute
                          right-2.5
                          top-1/2
                          -translate-y-1/2
                          text-[#8b4513]
                          hover:text-[#6f311c]
                          rounded
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#8b4513]
                        "
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <p className="text-[9px] text-gray-500">
                    Example: Google Drive video or another supported video link.
                  </p>
                </div>

                {/* PDF / REFERENCE */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="pdf-url"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#6f311c]"
                  >
                    5. Reference Material — Open via Link
                  </label>

                  <div className="relative">
                    <FileText
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-[#8b4513]
                        pointer-events-none
                      "
                    />

                    <input
                      id="pdf-url"
                      type="url"
                      placeholder="Paste the shareable PDF/material link"
                      className="
                        w-full
                        bg-[#f5f0eb]/50
                        border
                        border-[#e7d8cc]
                        rounded-lg
                        pl-9
                        pr-9
                        py-2.5
                        text-xs
                        placeholder-gray-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#8b4513]/20
                        focus:border-[#8b4513]
                        focus:bg-white
                        focus-visible:ring-[#8b4513]
                        transition-all
                        text-black
                      "
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                    />

                    {isValidUrl(pdfUrl) && (
                      <a
                        href={pdfUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open reference material link in a new tab to test it"
                        title="Test this link"
                        className="
                          absolute
                          right-2.5
                          top-1/2
                          -translate-y-1/2
                          text-[#8b4513]
                          hover:text-[#6f311c]
                          rounded
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#8b4513]
                        "
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <p className="text-[9px] text-gray-500">
                    Example: worksheet, PDF, notes, or other reference material.
                  </p>
                </div>

                {/* FINAL REMINDER */}
                <div className="flex items-start gap-2 rounded-lg bg-[#f5f0eb] border border-[#e7d8cc] px-3 py-2">
                  <CheckCircle2
                    size={14}
                    className="text-[#8b4513] mt-0.5 shrink-0"
                  />

                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    Check all links once before publishing. Students should
                    be able to open the lecture and reference material
                    without requesting access.
                  </p>
                </div>

                {/* SUBMIT */}
                <div className="pt-0.5">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={
                      prefersReducedMotion || submitting
                        ? undefined
                        : { scale: 1.01 }
                    }
                    whileTap={
                      prefersReducedMotion || submitting
                        ? undefined
                        : { scale: 0.98 }
                    }
                    className="
                      w-full
                      bg-[#431b11]
                      hover:bg-[#35140d]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      text-white
                      font-bold
                      py-3
                      rounded-lg
                      shadow-md
                      hover:shadow-lg
                      transition-colors
                      duration-200
                      tracking-wide
                      text-xs
                      sm:text-sm
                      flex
                      items-center
                      justify-center
                      gap-2
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#8b4513]
                      focus-visible:ring-offset-2
                    "
                  >
                    {submitting ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        Publish Lesson Module
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}