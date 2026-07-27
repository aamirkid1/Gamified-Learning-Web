"use client";

import {
  BookOpen,
  Brain,
  Gauge,
  Sparkles,
  Users,
} from "lucide-react";

export default function CourseHero({ course, lessonsCount, quizzesCount, studentCount }) {
  if (!course) return null;

  const thumbnail =
    course.thumbnail && course.thumbnail.trim() !== ""
      ? course.thumbnail
      : "/images/default-course.jpg";

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#4b1d12] via-[#6b1f0f] to-[#8b4513] text-white shadow-2xl shadow-black/30 border border-white/10">

      {/* Background Glow */}
      <div className="absolute right-0 top-0 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />

      <div className="relative grid gap-8 sm:gap-10 p-6 sm:p-8 md:p-10 lg:p-12 md:grid-cols-2 items-center">

        {/* LEFT SIDE */}
        <div className="space-y-5 sm:space-y-6 order-2 md:order-1">

          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 shadow-sm">
            <Sparkles size={14} className="text-white/90" />
            University Course
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-gray-200/90 max-w-xl">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-300">
                  Lessons
                </p>
                <h3 className="text-lg sm:text-xl font-bold">
                  {lessonsCount ?? course.lessonCount ?? 0}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-300">
                  Quizzes
                </p>
                <h3 className="text-lg sm:text-xl font-bold">
                  {quizzesCount ?? course.quizCount ?? 0}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Users size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-300">
                  Students
                </p>
                <h3 className="text-lg sm:text-xl font-bold">
                  {studentCount ?? 0}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Gauge size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-wide text-gray-300">
                  Difficulty
                </p>
                <h3 className="text-lg sm:text-xl font-bold">
                  Beginner
                </h3>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center order-1 md:order-2">

          <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-4 border-white/90 shadow-2xl shadow-black/40 w-full max-w-md">

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" />

            <img
              src={thumbnail}
              alt={course.title}
              className="w-full h-[240px] sm:h-[290px] md:h-[330px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/images/default-course.jpg";
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}