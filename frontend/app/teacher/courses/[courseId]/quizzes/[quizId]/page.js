"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function QuizDetailsPage() {
  const { courseId, quizId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const response = await fetch(
        `http://localhost:3000/quizzes/${quizId}/students`
      );

      const data = await response.json();

      setStudents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const passed = students.filter((s) => s.passed).length;
  const failed = students.length - passed;
  const averageScore =
    students.length === 0
      ? 0
      : Math.round(
          students.reduce((sum, student) => sum + student.percentage, 0) /
            students.length
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#e9ddd0] border-t-[#8b4513] rounded-full animate-spin" />
          <p className="text-[#6f311c] font-medium">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3b130d] via-[#6f311c] to-[#8b4513] px-6 sm:px-10 py-8 sm:py-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-[#e8c9a8] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-1">
              Quiz
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Quiz Details
            </h1>
            <p className="text-[#f0ded0] mt-2 text-sm sm:text-base">
              Track quiz performance
            </p>
          </div>

          <Link href={`/teacher/courses/${courseId}`} className="w-full sm:w-auto">
            <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200">
              ← Back
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Statistics */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 border border-[#eee3d6]">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Passed</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-green-600 mt-3">
              {passed}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 border border-[#eee3d6]">
            <p className="text-gray-500 text-sm uppercase tracking-wide">Failed</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-red-600 mt-3">
              {failed}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 sm:p-8 border border-[#eee3d6]">
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              Average Score
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-[#6f311c] to-[#8b4513] bg-clip-text text-transparent mt-3">
              {averageScore}%
            </h2>
          </div>
        </div>

        {/* Students */}
        <div className="mt-10 sm:mt-12 pb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3b130d] mb-6">
            Students
          </h2>

          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white/60 border border-dashed border-[#c9a68a] rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[#f0ded0] flex items-center justify-center mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-[#3b130d]">
                No submissions yet
              </h3>
              <p className="text-gray-500 mt-2 max-w-sm">
                Once students attempt this quiz, their results will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-[#eee3d6] transition-all duration-300 p-6 flex flex-col sm:flex-row justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#f0ded0] flex items-center justify-center text-[#6f311c] font-bold text-lg">
                      {student.name?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-[#3b130d]">
                        {student.name}
                      </h3>

                      <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Roll No: {student.rollNo}
                      </p>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Student ID: {student.studentId}
                      </p>
                      <p className="text-gray-500 text-sm sm:text-base">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right flex flex-col sm:items-end gap-2">
                    <span
                      className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        student.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.passed ? "Passed" : "Failed"}
                    </span>

                    <p className="text-gray-500 text-sm sm:text-base">
                      Score: {student.score}
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Percentage: {student.percentage}%
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {new Date(student.submittedAt).toLocaleString()}
                    </p>

                    <p className="font-bold text-[#6f311c] mt-1">
                      +{student.xpEarned} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}