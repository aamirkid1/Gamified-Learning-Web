"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  Lock,
  CheckCircle,
  Sparkles,
  X,
} from "lucide-react";

export default function StickyEnrollmentCard({
  course,
  lessons,
  quizzes,
  studentCount,
  isEnrolled,
  handleEnroll,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const confirmEnrollment = async () => {
    try {
      setLoading(true);
      await handleEnroll();
      setLoading(false);
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const currentLesson = lessons.find(
    (lesson) => !lesson.completed && !lesson.locked
  );

  const completedLessons = lessons.filter(
    (lesson) => lesson.completed
  ).length;

  const allCompleted =
    lessons.length > 0 &&
    completedLessons === lessons.length;

  const progressPercent = Math.round(
    (completedLessons / Math.max(lessons.length, 1)) * 100
  );

  return (
    <>
      <div className="lg:sticky lg:top-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#eaded4] shadow-lg sm:shadow-xl overflow-hidden">

          {/* Thumbnail */}
          {course?.thumbnail && (
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-44 sm:h-52 md:h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-5 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-[#3b130d] break-words">
              {course?.title}
            </h2>

            <p className="text-gray-500 mt-2.5 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7">
              Start learning today and unlock the complete course.
            </p>

            {/* Button */}
            {!isEnrolled ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="group w-full mt-5 sm:mt-6 relative overflow-hidden bg-[#6b1f0f] hover:bg-[#4b1508] text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Sparkles size={18} className="opacity-90" />
                  Enroll Now
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentLesson) {
                    router.push(`/lesson/${currentLesson.id}`);
                  }
                }}
                disabled={!currentLesson}
                className="
                  w-full
                  mt-5 sm:mt-6
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-r
                  from-[#8b4513]
                  via-[#96501a]
                  to-[#a0522d]
                  text-white
                  font-bold
                  py-3.5 sm:py-4
                  px-4
                  text-sm sm:text-base
                  shadow-lg sm:shadow-xl
                  hover:scale-[1.02]
                  hover:shadow-[0_15px_40px_rgba(139,69,19,0.35)]
                  transition-all
                  duration-300
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  truncate
                "
              >
                {allCompleted
                  ? "Course Completed 🎉"
                  : currentLesson
                  ? `Continue: ${currentLesson.title} →`
                  : "Continue Learning →"}
              </button>
            )}

            {/* Progress Card */}
            <div
              className="
                mt-6 sm:mt-8
                rounded-2xl sm:rounded-3xl
                bg-gradient-to-br
                from-[#fffdfb]
                to-[#f8f3ef]
                border
                border-[#eaded4]
                p-5 sm:p-6
                shadow-sm
              "
            >
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="font-bold text-[#3b130d] text-sm sm:text-base">
                  Course Progress
                </h3>

                {isEnrolled ? (
                  <span className="flex items-center gap-1.5 text-green-700 font-bold text-xs sm:text-sm bg-green-50 border border-green-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="text-gray-500 font-semibold text-xs sm:text-sm bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Not Started
                  </span>
                )}
              </div>

              <div className="w-full h-2.5 sm:h-3 bg-[#eaded4] rounded-full overflow-hidden">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-[#8b4513]
                    via-[#9c5321]
                    to-[#c46d32]
                    transition-all
                    duration-700
                    ease-out
                  "
                  style={{
                    width: isEnrolled ? `${progressPercent}%` : "0%",
                  }}
                />
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
                <span>
                  {completedLessons} of {lessons.length} lessons
                </span>
                <span className="font-semibold text-[#8b4513]">
                  {isEnrolled ? progressPercent : 0}%
                </span>
              </div>
            </div>

            {/* Course Overview */}
            <div className="mt-6 sm:mt-8 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#3b130d]">
                Course Overview
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Everything included in this learning journey.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">

              {/* Lessons */}
              <div
                className="
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-br
                  from-white
                  to-[#fbf6f1]
                  border
                  border-[#eaded4]
                  p-3 sm:p-5
                  text-center
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:border-[#e0c9b8]
                  transition-all
                  duration-300
                "
              >
                <div className="mx-auto h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-[#f3e5da]">
                  <BookOpen className="text-[#8b4513]" size={18} />
                </div>
                <p className="text-2xl sm:text-4xl font-black text-[#3b130d] mt-2 sm:mt-3">
                  {lessons.length}
                </p>
                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  Lessons
                </p>
              </div>

              {/* Quizzes */}
              <div
                className="
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-br
                  from-white
                  to-[#fbf6f1]
                  border
                  border-[#eaded4]
                  p-3 sm:p-5
                  text-center
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:border-[#e0c9b8]
                  transition-all
                  duration-300
                "
              >
                <div className="mx-auto h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-[#f3e5da]">
                  <FileQuestion className="text-[#8b4513]" size={18} />
                </div>
                <p className="text-2xl sm:text-4xl font-black text-[#3b130d] mt-2 sm:mt-3">
                  {quizzes.length}
                </p>
                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  Quizzes
                </p>
              </div>

              {/* Students */}
              <div
                className="
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-br
                  from-white
                  to-[#fbf6f1]
                  border
                  border-[#eaded4]
                  p-3 sm:p-5
                  text-center
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:border-[#e0c9b8]
                  transition-all
                  duration-300
                "
              >
                <div className="mx-auto h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-[#f3e5da]">
                  <GraduationCap className="text-[#8b4513]" size={18} />
                </div>
                <p className="text-2xl sm:text-4xl font-black text-[#3b130d] mt-2 sm:mt-3">
                  {studentCount}
                </p>
                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  Students
                </p>
              </div>

            </div>

            {/* Unlock Section */}
            {!isEnrolled && (
              <div className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl bg-[#f9f5f1] p-4 sm:p-5 border border-[#eaded4]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#f3e5da]">
                    <Lock size={14} className="text-[#8b4513]" />
                  </div>
                  <h3 className="font-bold text-[#3b130d] text-sm sm:text-base">
                    Unlock
                  </h3>
                </div>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    Lessons
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    Videos
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    Flashcards
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    Quizzes
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    XP Rewards
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b4513]" />
                    Certificate
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-[420px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#f3e5da] mb-4">
              <Sparkles size={22} className="text-[#8b4513]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#3b130d]">
              Confirm Enrollment
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Are you sure you want to enroll in{" "}
              <span className="font-bold text-[#3b130d]">{course?.title}</span>?
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition text-sm sm:text-base font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-[#6b1f0f] hover:bg-[#4b1508] text-white font-bold transition disabled:opacity-50 text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                {loading ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-[420px] text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto h-16 w-16 sm:h-[70px] sm:w-[70px] flex items-center justify-center rounded-full bg-green-50">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="mt-5 text-xl sm:text-2xl font-bold text-[#3b130d]">
              Enrollment Successful
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              You are now enrolled in this course.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-7 sm:mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
}
