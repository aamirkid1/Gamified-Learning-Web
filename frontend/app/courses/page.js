"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import courseService from "../../services/courseService";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#eaded4]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#3b130d] tracking-tight">
            Explore Courses
          </h1>

          <p className="text-gray-500 text-sm md:text-base mt-1 font-medium">
            Select a learning pathway, test your competencies, and unlock achievements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8b4513] bg-white px-4 py-2 rounded-xl border border-[#eaded4] shadow-sm">
          <BookOpen size={14} />
          <span>{courses.length} Tracks Available</span>
        </div>
      </div>

      {/* COURSES */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#eaded4] max-w-md mx-auto mt-12">
          <GraduationCap
            className="mx-auto text-[#6f311c] mb-4 opacity-40"
            size={48}
          />

          <h3 className="text-lg font-bold text-[#3b130d]">
            No courses published yet
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Check back soon or add items via the instructor space.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl border border-[#eaded4] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                {/* IMAGE SECTION */}
                <div className="w-full h-52 bg-[#f5f5f5] flex items-center justify-center border-b border-[#eaded4]">

                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="max-w-full max-h-full object-contain p-2"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}

                  {/* FALLBACK */}
                  <div
                    className="absolute flex flex-col items-center justify-center"
                    style={{
                      display: course.thumbnail ? "none" : "flex",
                    }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6f311c] to-[#3b130d] flex items-center justify-center mb-3">
                      <GraduationCap
                        className="text-white"
                        size={28}
                      />
                    </div>

                    <span className="text-[#8b4513] text-xs font-bold uppercase tracking-wider">
                      Course Curriculum Track
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#3b130d] mb-2">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[#8b4513] font-bold uppercase text-xs tracking-wider">
                    <span className="group-hover:underline">
                      Enter Course
                    </span>

                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}