"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import courseService from "@/services/courseService";

export default function TeacherCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    async function loadCourses() {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const data = await courseService.getTeacherCourses(user.id);
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f0eb]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3b130d] via-[#6f311c] to-[#8b4513] px-6 sm:px-8 py-8 sm:py-10 shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p className="text-[#e8c9a8] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-1">
                            Teacher Dashboard
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                            My Courses
                        </h1>
                        <p className="text-[#f0ded0] mt-2 text-sm sm:text-base">
                            Manage all your courses in one place.
                        </p>
                    </div>

                    <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                        <Link href="/teacher" className="flex-1 sm:flex-none">
                            <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200">
                                Dashboard
                            </button>
                        </Link>

                        <Link href="/teacher/create-course" className="flex-1 sm:flex-none">
                            <button className="w-full bg-white text-[#6f311c] font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                + Create Course
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-10 sm:py-14 px-6 sm:px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                            >
                                <div className="h-48 sm:h-52 w-full bg-[#e9ddd0]" />
                                <div className="p-6 space-y-4">
                                    <div className="h-6 w-3/4 bg-[#e9ddd0] rounded-md" />
                                    <div className="h-4 w-full bg-[#efe6db] rounded-md" />
                                    <div className="h-4 w-2/3 bg-[#efe6db] rounded-md" />
                                    <div className="grid grid-cols-3 gap-4 pt-4">
                                        <div className="h-10 bg-[#efe6db] rounded-md" />
                                        <div className="h-10 bg-[#efe6db] rounded-md" />
                                        <div className="h-10 bg-[#efe6db] rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/60 border border-dashed border-[#c9a68a] rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-[#f0ded0] flex items-center justify-center mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#3b130d]">
                            No courses yet
                        </h3>
                        <p className="text-gray-500 mt-2 max-w-sm">
                            Create your first course to start building lessons and quizzes for your students.
                        </p>
                        <Link href="/teacher/create-course" className="mt-6">
                            <button className="bg-[#6f311c] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#8b4513] hover:shadow-lg transition-all duration-200">
                                + Create Course
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-[#eee3d6] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={course.thumbnail || "https://placehold.co/600x300"}
                                        alt={course.title}
                                        className="h-48 sm:h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#3b130d] leading-snug line-clamp-1">
                                        {course.title}
                                    </h2>

                                    <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-2 min-h-[2.5rem]">
                                        {course.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 text-center">
                                        <div className="bg-[#f5f0eb] rounded-xl py-3">
                                            <p className="text-2xl sm:text-3xl font-bold text-[#3b130d]">
                                                {course.studentCount}
                                            </p>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 mt-1">
                                                Students
                                            </p>
                                        </div>

                                        <div className="bg-[#f5f0eb] rounded-xl py-3">
                                            <p className="text-2xl sm:text-3xl font-bold text-[#3b130d]">
                                                {course.lessonCount}
                                            </p>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 mt-1">
                                                Lessons
                                            </p>
                                        </div>

                                        <div className="bg-[#f5f0eb] rounded-xl py-3">
                                            <p className="text-2xl sm:text-3xl font-bold text-[#3b130d]">
                                                {course.quizCount}
                                            </p>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500 mt-1">
                                                Quizzes
                                            </p>
                                        </div>
                                    </div>

                                    <Link href={`/teacher/courses/${course.id}`}>
                                        <button className="mt-8 w-full bg-[#6f311c] text-white py-3 rounded-xl hover:bg-[#5b2817] transition">
                                            Open Course
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}