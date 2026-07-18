"use client";

import { Mail, BadgeCheck, GraduationCap } from "lucide-react";

export default function TeacherCard({ teacher }) {
  if (!teacher) return null;

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-[#eaded4] overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#6b1f0f] to-[#8b4513] px-8 py-5">
        <h2 className="text-2xl font-bold text-white">
          Course Instructor
        </h2>

        <p className="text-gray-200 text-sm mt-1">
          Meet the instructor responsible for this course.
        </p>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col md:flex-row gap-8 items-center">

        {/* Avatar */}
        <div className="flex-shrink-0">

          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#8b4513] to-[#5b2415] flex items-center justify-center shadow-xl border-4 border-[#f4ebe4]">

            <span className="text-5xl font-black text-white">
              {teacher.name?.charAt(0).toUpperCase()}
            </span>

          </div>

        </div>

        {/* Details */}
        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h3 className="text-3xl font-black text-[#3b130d]">
              {teacher.name}
            </h3>

            <BadgeCheck
              size={24}
              className="text-blue-500"
            />

          </div>

          <div className="flex items-center gap-2 mt-4 text-[#6b1f0f]">

            <GraduationCap size={20} />

            <span className="font-semibold capitalize">
              {teacher.role}
            </span>

          </div>

          <div className="flex items-center gap-2 mt-3 text-gray-700">

            <Mail size={18} />

            <span>{teacher.email}</span>

          </div>

          <div className="mt-6 rounded-2xl bg-[#f9f5f1] border border-[#eaded4] p-5">

            <h4 className="font-bold text-[#6b1f0f] mb-2">
              About Instructor
            </h4>

            <p className="text-gray-600 leading-7">
              This instructor created and manages this course. Only the
              assigned instructor can add lessons, quizzes, flashcards,
              assignments and review student submissions.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}