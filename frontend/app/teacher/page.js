"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";

export default function TeacherDashboard() {

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    activeQuizzes: 0,
  });

  const loadStats = async () => {
    const data = await dashboardService.getStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#3b130d] text-white font-sans selection:bg-[#6f311c]">
      {/* Top Strip */}
      <div className="h-2 bg-[#6b1f0f] w-full"></div>

      {/* Navbar / Header */}
      <header className="bg-[#8b4513] px-6 md:px-12 py-6 shadow-md border-b border-[#6b1f0f]/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 font-medium">
              Manage courses, lessons, and track student assessments.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#3b130d]/40 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-gray-200 uppercase">
              Instructor Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16">

        {/* Quick Actions Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-[#8b4513] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Create Course Card */}
            <Link href="/teacher/create-course" className="group">
              <div className="h-full bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group-hover:shadow-2xl group-hover:bg-[#6f311c]/90">
                <div>
                  <div className="w-14 h-14 bg-[#3b130d]/60 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    📚
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-100">
                    Create Course
                  </h3>
                  <p className="text-gray-300/90 text-sm leading-relaxed">
                    Set up new curriculum tracks, configure student access, and organize core modules.
                  </p>
                </div>
                <div className="mt-8 w-full bg-[#431b11] py-3 rounded-xl font-semibold tracking-wide text-center text-sm border border-transparent group-hover:bg-[#35140d] group-hover:border-white/10 transition-all shadow-md">
                  Open Creator
                </div>
              </div>
            </Link>

            {/* Add Lesson Card */}
            <Link href="/teacher/create-lesson" className="group">
              <div className="h-full bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group-hover:shadow-2xl group-hover:bg-[#6f311c]/90">
                <div>
                  <div className="w-14 h-14 bg-[#3b130d]/60 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    🎓
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-100">
                    Add Lesson
                  </h3>
                  <p className="text-gray-300/90 text-sm leading-relaxed">
                    Upload supplementary files, interactive video content, and reading documents.
                  </p>
                </div>
                <div className="mt-8 w-full bg-[#431b11] py-3 rounded-xl font-semibold tracking-wide text-center text-sm border border-transparent group-hover:bg-[#35140d] group-hover:border-white/10 transition-all shadow-md">
                  Add Content
                </div>
              </div>
            </Link>

            {/* Create Quiz Card */}
            {/* <div className="h-full bg-[#6f311c]/50 rounded-2xl p-8 border border-[#8b4513]/30 flex flex-col justify-between opacity-85 relative overflow-hidden backdrop-blur-sm">
              <div>
                <div className="w-14 h-14 bg-[#3b130d]/40 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5">
                  📝
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-300">
                  Create Quiz
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Design knowledge checks, customizable assessments, and grade distribution models.
                </p>
              </div>
              <div className="mt-8 w-full bg-[#3b130d]/60 py-3 rounded-xl font-medium tracking-wide text-center text-sm text-gray-400 border border-white/5 cursor-not-allowed">
                Coming Soon
              </div>
            </div> */}


            {/* Create Quiz Card */}
            <Link href="/teacher/create-quiz" className="group">
              <div className="h-full bg-[#6f311c] rounded-2xl p-8 shadow-xl border border-[#8b4513]/60 hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group-hover:shadow-2xl group-hover:bg-[#6f311c]/90">

                <div>
                  <div className="w-14 h-14 bg-[#3b130d]/60 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    📝
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-100">
                    Create Quiz
                  </h3>

                  <p className="text-gray-300/90 text-sm leading-relaxed">
                    Create assessments, MCQs, short-answer questions and evaluate student learning outcomes.
                  </p>
                </div>

                <div className="mt-8 w-full bg-[#431b11] py-3 rounded-xl font-semibold tracking-wide text-center text-sm border border-transparent group-hover:bg-[#35140d] group-hover:border-white/10 transition-all shadow-md">
                  Create Quiz
                </div>

              </div>
            </Link>

          </div>
        </section>

        {/* Stats Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-[#8b4513] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">
              Overview Performance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Total Courses */}
            <div className="bg-gradient-to-br from-[#6f311c] to-[#592413] p-6 rounded-2xl shadow-lg border border-[#8b4513]/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Total Courses
                </p>
                <p className="text-3xl font-black tracking-tight text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3b130d]/50 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                📚
              </div>
            </div>

            {/* Total Lessons */}
            <div className="bg-gradient-to-br from-[#6f311c] to-[#592413] p-6 rounded-2xl shadow-lg border border-[#8b4513]/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Active Lessons
                </p>
                <p className="text-3xl font-black tracking-tight text-white">
                  {stats.totalLessons}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3b130d]/50 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                🎓
              </div>
            </div>

            {/* Active Quizzes */}
            <div className="bg-gradient-to-br from-[#6f311c] to-[#592413] p-6 rounded-2xl shadow-lg border border-[#8b4513]/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Active Quizzes
                </p>
                <p className="text-3xl font-black tracking-tight text-white">
                  {stats.activeQuizzes}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3b130d]/50 rounded-xl flex items-center justify-center text-2xl shadow-inner opacity-60">
                📝
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}