"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import lessonService from "../../../services/lessonService";

const TIPS = [
  {
    icon: "📂",
    title: "Pick the right home",
    body: "Select the correct parent course before anything else.",
  },
  {
    icon: "📖",
    title: "Write with clarity",
    body: "Keep lecture prose short, direct, and easy to scan.",
  },
  {
    icon: "🎥",
    title: "Stream, don't upload",
    body: "Host video through a secure stream URL, not a raw file.",
  },
  {
    icon: "📄",
    title: "Give them a takeaway",
    body: "Attach a reference PDF for reading off-platform.",
  },
];

export default function CreateLesson() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses");
      const data = await response.json();
      setCourses(data);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Signature element: the form tracks its own completeness as the lesson
  // is "assembled" — video/PDF are optional enrichments, so they count as
  // bonus progress rather than blockers.
  const steps = useMemo(
    () => [
      { label: "Course", done: Boolean(courseId) },
      { label: "Title", done: title.trim().length > 0 },
      { label: "Notes", done: content.trim().length > 0 },
      { label: "Video", done: videoUrl.trim().length > 0 },
      { label: "PDF", done: pdfUrl.trim().length > 0 },
    ],
    [courseId, title, content, videoUrl, pdfUrl]
  );
  const doneCount = steps.filter((s) => s.done).length;
  const progressPct = Math.round((doneCount / steps.length) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await lessonService.createLesson({
        title,
        content,
        videoUrl,
        pdfUrl,
        courseId: Number(courseId),
      });

      alert("Lesson Created Successfully");

      setTitle("");
      setContent("");
      setVideoUrl("");
      setPdfUrl("");
    } finally {
      setSubmitting(false);
    }
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
      {/* Top Strip */}
      <div className="h-2 bg-gradient-to-r from-[#6b1f0f] via-[#8b4513] to-[#6b1f0f]" />

      {/* Header */}
      <div className="relative bg-[#3b130d] px-5 sm:px-8 py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 w-96 h-96 bg-[#8b4513]/25 blur-[110px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#a0522d]/15 blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#e0a976] mb-3">
              Course Builder
            </span>
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Add New Lesson
            </h1>
            <p className="text-[#d8c3b3] mt-3 text-sm sm:text-base max-w-md">
              Expand your course tracks with rich educational lectures and media assets.
            </p>
          </div>
          <Link href="/teacher">
            <button className="self-start md:self-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold shadow border border-white/15 backdrop-blur-sm transition">
              ← Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Main Area */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 -mt-6 sm:-mt-8 pb-16">
        <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">

          {/* Form Card */}
          <div className="order-1 md:order-2 md:col-span-3 bg-white rounded-3xl shadow-2xl shadow-[#3b130d]/10 border border-[#e7d8cc] overflow-hidden">

            {/* Card Header + progress tracker (signature element) */}
            <div className="bg-[#6f311c] px-6 sm:px-8 pt-6 pb-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    Lesson Information Form
                  </h2>
                  <p className="text-[#e3c4ac] text-xs mt-1">
                    Input metadata fields to deploy updates to the live layout.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-black text-white leading-none">
                    {doneCount}
                    <span className="text-sm font-semibold text-[#e3c4ac]">/{steps.length}</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#e3c4ac] mt-0.5">
                    Assembled
                  </p>
                </div>
              </div>

              {/* Progress rail */}
              <div className="mt-4 h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#cd853f] to-[#e0a976] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {steps.map((s) => (
                  <span
                    key={s.label}
                    className={`text-[11px] font-semibold tracking-wide flex items-center gap-1 transition-colors ${
                      s.done ? "text-[#f3d9bd]" : "text-white/35"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        s.done ? "bg-[#e0a976]" : "bg-white/25"
                      }`}
                    />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">

              {/* Field 1: Dropdown Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                  Target Course Connection
                </label>
                {coursesLoading ? (
                  <div className="h-[52px] w-full rounded-xl bg-[#f5f0eb] border border-[#e7d8cc] animate-pulse" />
                ) : (
                  <select
                    required
                    className="w-full bg-[#f5f0eb]/50 border border-[#e7d8cc] rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-black cursor-pointer disabled:opacity-50"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled={courses.length === 0}
                  >
                    <option value="" className="text-gray-400">
                      {courses.length === 0
                        ? "-- No courses available --"
                        : "-- Select Parent Course --"}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="text-black">
                        {course.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Field 2: Lesson Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Module 1: Foundational Frameworks"
                  className="w-full bg-[#f5f0eb]/50 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Field 3: Lesson Content Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                  Lecture Notes & Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Draft text details, markdown points, or structural definitions..."
                  className="w-full bg-[#f5f0eb]/50 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-black resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Field 4: Video URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                  Video Lecture URL
                </label>
                <input
                  type="url"
                  placeholder="https://streaming-provider.com/lecture-1"
                  className="w-full bg-[#f5f0eb]/50 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-black"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              {/* Field 5: PDF URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6f311c]">
                  Reference Worksheet PDF URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/vault/syllabus-doc.pdf"
                  className="w-full bg-[#f5f0eb]/50 border border-[#e7d8cc] rounded-xl p-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b4513]/20 focus:border-[#8b4513] focus:bg-white transition-all text-black"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#431b11] hover:bg-[#35140d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 tracking-wide text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Lesson Module"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Left Side Info Panel */}
          <div className="order-2 md:order-1 md:col-span-2 flex flex-col gap-6 md:pt-2">
            <div className="border-l-4 border-[#8b4513] pl-5">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#3b130d] leading-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Lesson Assembly
              </h2>
              <p className="text-gray-700 mt-3 leading-relaxed text-sm sm:text-base">
                Attach clear reading material, streaming links, and structured
                syllabus references directly to an existing course track.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-[#3b130d]/5 border border-[#e7d8cc] overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-[#f0e6da]">
                <h3 className="text-base font-bold text-[#6f311c] tracking-wide uppercase text-xs">
                  Content Tips
                </h3>
              </div>
              <ul className="divide-y divide-[#f0e6da]">
                {TIPS.map((tip) => (
                  <li key={tip.title} className="flex items-start gap-3 px-6 py-4">
                    <span className="shrink-0 w-9 h-9 rounded-lg bg-[#f5f0eb] flex items-center justify-center text-base border border-[#e7d8cc]">
                      {tip.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#3b130d]">{tip.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {tip.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
