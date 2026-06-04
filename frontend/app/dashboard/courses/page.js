"use client";

import Link from "next/link";
import {
  GraduationCap,
  Lock,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Educational Psychology",
    description:
      "Introduction to Educational Psychology",
  },
  {
    id: 2,
    title: "DSA",
    description:
      "Useful for building applications",
  },
  {
    id: 3,
    title: "Introduction to JavaScript",
    description:
      "Helpful in web development",
  },
];

export default function PublicCourses() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] p-8">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-[#6b1f0f]">
            Explore Courses
          </h1>

          <p className="text-gray-600 mt-4">
            Browse available learning tracks.
            Login to start learning.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {courses.map((course) => (

            <div
              key={course.id}
              className="
                bg-white
                rounded-3xl
                shadow-lg
                overflow-hidden
                hover:shadow-xl
                transition
              "
            >

              <div
                className="
                  h-52
                  flex
                  items-center
                  justify-center
                  bg-gray-100
                "
              >

                <GraduationCap
                  size={80}
                  className="text-[#8b4513]"
                />

              </div>

              <div className="p-6">

                <h2 className="text-2xl font-bold">

                  {course.title}

                </h2>

                <p className="mt-3 text-gray-600">

                  {course.description}

                </p>

                <button
                  disabled
                  className="
                    mt-6
                    w-full
                    bg-gray-200
                    text-gray-500
                    py-3
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    cursor-not-allowed
                  "
                >

                  <Lock size={18} />

                  Login To Access

                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="text-center mt-16">

          <Link
            href="/login"
            className="
              bg-[#8b4513]
              text-white
              px-8
              py-4
              rounded-xl
            "
          >
            Login To Start Learning
          </Link>

        </div>

      </div>
    </div>
  );
}