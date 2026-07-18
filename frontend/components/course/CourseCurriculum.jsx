"use client";

import {
  Lock,
  BookOpen,
} from "lucide-react";

export default function CourseCurriculum({
  lessons = [],
  isEnrolled,
}) {
  return (
    <section className="bg-white rounded-3xl shadow-lg border border-[#eaded4] p-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-3xl font-black text-[#3b130d]">
            Course Curriculum
          </h2>

          <p className="text-gray-500 mt-1">
            Complete each module in sequence.
          </p>
        </div>

        <div className="bg-[#8b4513] text-white px-4 py-2 rounded-xl font-semibold">
          {lessons.length} Modules
        </div>

      </div>

      <div className="space-y-5">

        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between rounded-2xl border border-[#eaded4] p-5 hover:shadow-md transition"
          >

            <div className="flex items-center gap-5">

              <div className="w-14 h-14 rounded-xl bg-[#8b4513] text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div>

                <h3 className="font-bold text-[#3b130d]">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Lecture Module
                </p>

              </div>

            </div>

            {isEnrolled ? (
              <BookOpen
                size={24}
                className="text-green-600"
              />
            ) : (
              <Lock
                size={24}
                className="text-gray-400"
              />
            )}

          </div>
        ))}

      </div>

    </section>
  );
}