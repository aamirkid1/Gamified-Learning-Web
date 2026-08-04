"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import courseService from "@/services/courseService";
import enrollmentService from "@/services/enrollmentService";
import lessonService from "@/services/lessonService";
import quizService from "@/services/quizService";

const NAV_ITEMS = [
    "Overview",
    "Students",
    "Lessons",
    "Quizzes",
    "Certificates",
    "Analytics",
];

export default function TeacherCourseDetails() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadCourse();
        }
    }, [courseId]);

    async function loadCourse() {
        try {
            const courseData =
                await courseService.getTeacherCourseDetails(courseId);

            setCourse(courseData);

            const studentData =
                await enrollmentService.getStudentsByCourse(courseId);

            setStudents(studentData);

            const lessonData =
                await lessonService.getTeacherLessons(courseId);

            setLessons(lessonData);

            const quizData =
                await quizService.getCourseQuizzes(courseId);

            setQuizzes(quizData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#e9ddd0] border-t-[#8b4513] rounded-full animate-spin" />
                    <p className="text-[#6f311c] font-medium">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f0eb] px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f0ded0] flex items-center justify-center mb-4">
                    <span className="text-3xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-[#3b130d]">
                    Course not found
                </h2>
                <p className="text-gray-500 mt-2">
                    It may have been removed or the link is incorrect.
                </p>
                <Link href="/teacher/courses" className="mt-6">
                    <button className="bg-[#6f311c] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#8b4513] transition-all duration-200">
                        ← Back to My Courses
                    </button>
                </Link>
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
                            Course
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-[#f0ded0] mt-2 text-sm sm:text-base max-w-2xl line-clamp-2">
                            {course.description}
                        </p>
                    </div>

                    <Link href="/teacher/courses" className="w-full sm:w-auto">
                        <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200">
                            ← My Courses
                        </button>
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-7xl mx-auto mt-8 sm:mt-10 px-6 sm:px-8">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#eee3d6]">
                    <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-full">
                            <img
                                src={course.thumbnail || "https://placehold.co/800x500"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>

                        <div className="p-8 sm:p-10 flex flex-col justify-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#3b130d]">
                                {course.title}
                            </h2>

                            <p className="mt-4 text-gray-600 leading-7 text-sm sm:text-base">
                                {course.description}
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#f0ded0] flex items-center justify-center text-[#6f311c] font-bold text-sm">
                                    {course.teacherName?.charAt(0) || "T"}
                                </div>
                                <p className="text-[#3b130d]">
                                    <span className="font-semibold">Instructor</span>{" "}
                                    <span className="text-gray-500">·</span>{" "}
                                    {course.teacherName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto mt-8 sm:mt-10 px-6 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 text-center border border-[#eee3d6]">
                        <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-[#6f311c] to-[#8b4513] bg-clip-text text-transparent">
                            {course.studentCount}
                        </p>
                        <p className="mt-3 uppercase text-gray-500 tracking-widest text-xs sm:text-sm">
                            Students
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 text-center border border-[#eee3d6]">
                        <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-[#6f311c] to-[#8b4513] bg-clip-text text-transparent">
                            {course.lessonCount}
                        </p>
                        <p className="mt-3 uppercase text-gray-500 tracking-widest text-xs sm:text-sm">
                            Lessons
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 text-center border border-[#eee3d6]">
                        <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-[#6f311c] to-[#8b4513] bg-clip-text text-transparent">
                            {course.quizCount}
                        </p>
                        <p className="mt-3 uppercase text-gray-500 tracking-widest text-xs sm:text-sm">
                            Quizzes
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="max-w-7xl mx-auto mt-8 sm:mt-10 px-6 sm:px-8 mb-16">
                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-[#eee3d6]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeTab === item;
                            return (
                                <button
                                    key={item}
                                    onClick={() => setActiveTab(item)}
                                    className={`rounded-xl py-3 text-sm sm:text-base font-medium transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-r from-[#6f311c] to-[#8b4513] text-white shadow-md"
                                        : "border border-[#e6d8c8] text-[#3b130d] hover:border-[#c9a68a] hover:bg-[#f5f0eb]"
                                        }`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}

            <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-20">

                {activeTab === "Overview" && (

                    <div className="bg-white rounded-2xl shadow-md border border-[#eee3d6] p-8">

                        <h2 className="text-3xl font-bold text-[#6f311c]">
                            Course Overview
                        </h2>

                        <div className="mt-8 grid md:grid-cols-2 gap-8">

                            <div>

                                <h3 className="font-semibold text-lg">
                                    Description
                                </h3>

                                <p className="mt-3 text-gray-600 leading-7">
                                    {course.description}
                                </p>

                            </div>

                            <div className="space-y-4">

                                <p>
                                    <span className="font-semibold">
                                        Instructor:
                                    </span>{" "}
                                    {course.teacherName}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Students:
                                    </span>{" "}
                                    {course.studentCount}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Lessons:
                                    </span>{" "}
                                    {course.lessonCount}
                                </p>

                                <p>
                                    <span className="font-semibold">
                                        Quizzes:
                                    </span>{" "}
                                    {course.quizCount}
                                </p>

                            </div>

                        </div>

                    </div>

                )}

                {activeTab === "Students" && (

                    <>

                        <h2 className="text-3xl font-bold text-[#6f311c] mb-8">

                            Students ({students.length})

                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {students.map((student) => (

                                <div
                                    key={student.id}
                                    className="bg-white rounded-2xl shadow-md border border-[#eee3d6] p-6 hover:shadow-xl transition"
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <h3 className="text-2xl font-bold">

                                                {student.name}

                                            </h3>

                                            <p className="text-gray-500 mt-2">

                                                Roll No: {student.rollNo}

                                            </p>

                                            <p className="text-gray-500">

                                                Student ID: {student.studentId}

                                            </p>

                                            <p className="text-gray-500">

                                                {student.email}

                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="font-semibold">

                                                Level {student.level}

                                            </p>

                                            <p className="text-2xl font-bold text-[#6f311c] mt-2">

                                                {student.xp}

                                            </p>

                                            <p className="text-gray-500 text-sm">

                                                XP

                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        className="mt-6 w-full bg-[#6f311c] hover:bg-[#5a2818] text-white py-3 rounded-xl transition"
                                    >

                                        View Profile

                                    </button>

                                </div>

                            ))}

                        </div>

                    </>

                )}

                {activeTab === "Lessons" && (

                    <>
                        <h2 className="text-3xl font-bold text-[#6f311c] mb-8">
                            Lessons ({lessons.length})
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {lessons.map((lesson) => (

                                <div
                                    key={lesson.id}
                                    className="bg-white rounded-2xl shadow-lg border border-[#eee3d6] rounded-2xl p-6 hover:shadow-xl transition"
                                >

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h3 className="text-2xl font-bold text-[#3b130d]">
                                                Lesson {lesson.orderNumber}
                                            </h3>

                                            <p className="text-gray-600 mt-2">
                                                {lesson.title}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <div className="text-green-600 font-semibold">

                                                Completed

                                            </div>

                                            <div className="text-3xl font-bold">

                                                {lesson.completedStudents}

                                            </div>

                                        </div>

                                    </div>

                                    <div className="mt-6 flex justify-between">

                                        <div>

                                            <p className="text-gray-500">
                                                Pending
                                            </p>

                                            <p className="text-xl font-bold text-red-600">
                                                {lesson.pendingStudents}
                                            </p>

                                        </div>

                                        <Link
                                            href={`/teacher/courses/${courseId}/lessons/${lesson.id}`}
                                        >
                                            <button
                                                className="px-6 py-3 bg-[#6f311c] hover:bg-[#5b2818] text-white rounded-xl transition"
                                            >
                                                Open Lesson
                                            </button>
                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>
                    </>

                )}

                {activeTab === "Quizzes" && (
                    <div className="max-w-7xl mx-auto px-6 pb-12">

                        <h2 className="text-5xl font-bold text-[#6f311c] mb-10">
                            Quizzes ({quizzes.length})
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">

                            {quizzes.map((quiz) => (

                                <div
                                    key={quiz.id}
                                    className="bg-white rounded-3xl shadow-md border border-[#eee3d6] p-8"
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <h3 className="text-4xl font-bold text-[#3b130d]">
                                                {quiz.title}
                                            </h3>

                                            <p className="text-xl text-gray-600 mt-2">
                                                {quiz.lessonTitle}
                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-green-600 font-semibold">
                                                Completed
                                            </p>

                                            <p className="text-5xl font-bold">
                                                {quiz.completedStudents}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-8">

                                        <p className="text-gray-500">
                                            Pending
                                        </p>

                                        <p className="text-4xl font-bold text-red-600">
                                            {quiz.pendingStudents}
                                        </p>

                                    </div>

                                    <Link
                                        href={`/teacher/courses/${courseId}/quizzes/${quiz.id}`}
                                    >
                                        <button
                                            className="mt-8 w-full bg-[#7c3518] hover:bg-[#5f2813] text-white py-4 rounded-2xl text-xl font-semibold"
                                        >
                                            Open Quiz
                                        </button>
                                    </Link>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

                {activeTab === "Certificates" && (

                    <div className="bg-white rounded-2xl shadow-md p-10">

                        <h2 className="text-2xl font-bold">
                            Certificates
                        </h2>

                        <p className="mt-4 text-gray-500">

                            Coming in Phase 7

                        </p>

                    </div>

                )}

                {activeTab === "Analytics" && (

                    <div className="bg-white rounded-2xl shadow-md p-10">

                        <h2 className="text-2xl font-bold">
                            Analytics
                        </h2>

                        <p className="mt-4 text-gray-500">

                            Coming in Phase 8

                        </p>

                    </div>

                )}

            </div>
        </div>
    );
}