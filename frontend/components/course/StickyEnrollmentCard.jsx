"use client";

import { useState } from "react";
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  Lock,
  CheckCircle,
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

  return (
    <>
      <div className="sticky top-8">
        <div className="bg-white rounded-3xl border border-[#eaded4] shadow-xl overflow-hidden">
          
          {/* Thumbnail */}
          {course?.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-56 object-cover"
            />
          )}

          <div className="p-6">
            <h2 className="text-2xl font-black text-[#3b130d]">
              {course?.title}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Start learning today and unlock the complete course.
            </p>

            {/* Button */}
            {!isEnrolled ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full mt-6 bg-[#6b1f0f] hover:bg-[#4b1508] text-white font-bold py-4 rounded-xl transition"
              >
                Enroll Now
              </button>
            ) : (
              <button className="w-full mt-6 bg-green-600 text-white font-bold py-4 rounded-xl">
                Continue Learning
              </button>
            )}

            {/* Statistics */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#8b4513]" />
                  <span>Lessons</span>
                </div>
                <span className="font-bold">{lessons.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileQuestion size={18} className="text-[#8b4513]" />
                  <span>Quizzes</span>
                </div>
                <span className="font-bold">{quizzes.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#8b4513]" />
                  <span>Students</span>
                </div>
                <span className="font-bold">{studentCount}</span>
              </div>
            </div>

            {/* Unlock Section */}
            {!isEnrolled && (
              <div className="mt-8 rounded-2xl bg-[#f9f5f1] p-5 border border-[#eaded4]">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={18} className="text-[#8b4513]" />
                  <h3 className="font-bold text-[#3b130d]">Unlock</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Lessons</li>
                  <li>• Videos</li>
                  <li>• Flashcards</li>
                  <li>• Quizzes</li>
                  <li>• XP Rewards</li>
                  <li>• Certificate</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">
            <h2 className="text-2xl font-bold text-[#3b130d]">
              Confirm Enrollment
            </h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to enroll in{" "}
              <span className="font-bold">{course?.title}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-[#6b1f0f] hover:bg-[#4b1508] text-white font-bold transition disabled:opacity-50"
              >
                {loading ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[420px] text-center shadow-2xl">
            <CheckCircle size={70} className="mx-auto text-green-600" />
            <h2 className="mt-5 text-2xl font-bold text-[#3b130d]">
              Enrollment Successful
            </h2>
            <p className="mt-3 text-gray-600">
              You are now enrolled in this course.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
}