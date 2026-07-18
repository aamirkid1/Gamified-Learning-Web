"use client";

import {
  CheckCircle,
  BookOpen,
  Laptop,
  Wifi,
} from "lucide-react";

export default function CourseOverview({ course }) {
  if (!course) return null;

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-[#eaded4] p-8">

      <h2 className="text-3xl font-black text-[#3b130d] mb-6">
        About this Course
      </h2>

      <p className="text-gray-600 leading-8 text-lg">
        {course.description}
      </p>

      {/* What You'll Learn */}

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-[#6b1f0f] mb-5">
          What You'll Learn
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <span>Understand the core concepts taught in this course.</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <span>Practice using quizzes and interactive lessons.</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <span>Earn XP and badges by completing modules.</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <span>Prepare yourself for real-world applications.</span>
          </div>

        </div>

      </div>

      {/* Requirements */}

      <div className="mt-10">

        <h3 className="text-2xl font-bold text-[#6b1f0f] mb-5">
          Requirements
        </h3>

        <div className="space-y-4">

          <div className="flex items-center gap-3">

            <Laptop className="text-[#8b4513]" size={20} />

            <span>
              A laptop or desktop computer
            </span>

          </div>

          <div className="flex items-center gap-3">

            <Wifi className="text-[#8b4513]" size={20} />

            <span>
              Stable internet connection
            </span>

          </div>

          <div className="flex items-center gap-3">

            <BookOpen className="text-[#8b4513]" size={20} />

            <span>
              Basic knowledge related to this subject
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}