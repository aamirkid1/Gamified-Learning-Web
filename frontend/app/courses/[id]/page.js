"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, Play, ArrowLeft, HelpCircle } from "lucide-react";
import enrollmentService from "@/services/enrollmentService";

export default function CourseDetails() {
  const params = useParams();

  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadLessons();
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (!user) return;

    checkEnrollment();
  }, [user]);

  const checkEnrollment = async () => {
    try {
      const enrollments =
        await enrollmentService.getStudentEnrollments(user.id);
      

      const enrolled = enrollments.some(
        (e) => e.courseId === Number(params.id)
      );

      setIsEnrolled(enrolled);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnroll = async () => {
    try {
      await enrollmentService.enroll(
        user.id,
        Number(params.id)
      );

      setIsEnrolled(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLessons = async () => {
    try {
      const response = await fetch("http://localhost:3000/lessons");
      const data = await response.json();

      const filteredLessons = data.filter(
        (lesson) => lesson.courseId === Number(params.id)
      );

      setLessons(filteredLessons);
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/quizzes"
      );

      const data = await response.json();

      setQuizzes(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative space-y-8 font-sans">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div
          className="
    absolute
    top-20
    right-20
    w-[300px]
    h-[300px]
    bg-[#8b4513]/5
    blur-[120px]
    rounded-full
    "
        />

        <div
          className="
    absolute
    bottom-20
    left-20
    w-[250px]
    h-[250px]
    bg-[#a0522d]/5
    blur-[100px]
    rounded-full
    "
        />

      </div>

      {/* TOP NAVIGATION BACK LINK */}
      <div className="flex items-center justify-between pb-4 border-b border-[#eaded4]">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8b4513] hover:text-[#6b1f0f] transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="transform group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Courses</span>
        </Link>

        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Syllabus Track
        </span>
      </div>
      {!isEnrolled && (
        <div className="bg-white rounded-2xl border border-[#eaded4] p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-[#3b130d]">
            You are not enrolled in this course.
          </h2>

          <p className="text-gray-500 mt-2">
            Enroll to access lessons and quizzes.
          </p>

          <button
            onClick={handleEnroll}
            className="mt-4 bg-[#8b4513] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6b1f0f]"
          >
            Enroll in Course
          </button>
        </div>
      )}
      {/* HEADER HERO AREA */}
      <div
        className="
  relative
  overflow-hidden
  bg-white/80
  backdrop-blur-md
  rounded-3xl
  p-8
  border
  border-[#eaded4]
  shadow-lg
  "
      >

        <div
  className="
  absolute
  right-0
  top-0
  w-48
  h-48
  bg-[#8b4513]/10
  blur-[80px]
  rounded-full
  "
/>
        <div className="absolute top-0 left-0 w-2 h-full bg-[#8b4513]" />
        <div className="pl-3 space-y-1">
          <h1 className="text-3xl font-black text-[#3b130d] tracking-tight">
            Course Syllabus
          </h1>

          <p className="text-gray-500 text-sm font-medium">
            Complete sequential modules to earn experience milestones and
            prepare for arena duels.
          </p>
        </div>
      </div>

      {/* SYLLABUS LESSONS TREE */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium text-sm animate-pulse">
          Loading timeline modules...
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#eaded4] max-w-md mx-auto">
          <HelpCircle
            className="mx-auto text-[#6f311c] mb-4 opacity-40"
            size={44}
          />

          <h3 className="text-lg font-bold text-[#3b130d]">
            No modules released yet
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            The instructor hasn't uploaded specific materials to this track
            timeline.
          </p>
        </div>
      ) : (
        <div className="
max-w-4xl
mx-auto
space-y-4
relative
before:absolute
before:top-2
before:bottom-2
before:left-[31px]
before:w-0.5
before:bg-gradient-to-b
before:from-[#8b4513]
before:to-[#eaded4]
">

          {lessons.map((lesson, index) => {

            // const lessonQuiz = quizzes.find(
            //   (quiz) => quiz.lessonId === lesson.id
            // );

            const lessonQuizzes = quizzes.filter(
              (quiz) => quiz.lessonId === lesson.id
            );

            return (
              <div key={lesson.id}>

                <Link
                  href={`/lesson/${lesson.id}`}
                  className="block group"
                >
                  <div className="
bg-white
rounded-3xl
border
border-[#eaded4]
shadow-sm
p-5
flex
items-center
gap-5
transition-all
duration-300
hover:shadow-2xl
hover:shadow-[0_10px_40px_rgba(139,69,19,0.15)]
hover:-translate-y-1
hover:border-[#8b4513]/40
relative
z-10
">

                    {/* MODULE NODE */}
                    <div
                      className="
  w-16
  h-16
  rounded-2xl
  bg-gradient-to-br
  from-[#8b4513]
  to-[#6b1f0f]
  flex
  flex-col
  items-center
  justify-center
  shadow-md
  "
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 leading-none">
                        Mod
                      </span>

                      <span className="text-xl font-black text-white leading-tight">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

                        <h2 className="text-lg font-bold text-[#3b130d] tracking-tight group-hover:text-[#6b1f0f] transition-colors line-clamp-1">
                          {lesson.title}
                        </h2>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8b4513] bg-[#f5f1ed] px-2 py-0.5 rounded-md border border-[#eaded4]">
                          <FileText size={10} />
                          Lecture
                        </span>

                      </div>

                      <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-1">
                        {lesson.content
                          ? lesson.content
                            .replace(/[^\w\s]/gi, "")
                            .substring(0, 110)
                          : "No lecture content description summarized."}
                        ...
                      </p>
                    </div>

                    {/* OPEN LESSON BUTTON */}
                    <div className="w-10 h-10 rounded-full bg-[#f5f1ed] text-[#8b4513] flex items-center justify-center flex-shrink-0 border border-[#eaded4] group-hover:bg-[#431b11] group-hover:text-white group-hover:border-[#431b11] transition-all duration-300 shadow-sm">
                      <Play size={14} className="fill-current ml-0.5" />
                    </div>

                  </div>
                </Link>

                {/* QUIZ CARD */}
                {/* {lessonQuiz && (
                  <div className="ml-20 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">

                    hover:scale-105

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                          Quiz Available
                        </p>

                        <h3 className="font-bold text-[#3b130d]">
                          {lessonQuiz.title}
                        </h3>
                      </div>

                      <Link href={`/quiz/${lessonQuiz.id}`}>
                        <button className="bg-[#8b4513] hover:bg-[#6f311c] text-white px-5 py-2 rounded-lg font-semibold">
                          Start Quiz
                        </button>
                      </Link>

                    </div>

                  </div>
                )} */}

                {lessonQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="
ml-0
md:ml-20
mt-4
bg-gradient-to-r
from-[#fff8e6]
to-[#fffdf8]
border
border-[#f0d88c]
rounded-2xl
p-5
shadow-sm
hover:shadow-md
transition-all
"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                          Quiz Available
                        </p>

                        <h3 className="font-bold text-[#3b130d]">
                          {quiz.title}
                        </h3>
                      </div>

                      <Link href={`/quiz/${quiz.id}`}>
                        <button className="
bg-gradient-to-r
from-[#8b4513]
to-[#a0522d]
text-white
px-6
py-3
rounded-xl
font-bold
shadow-md
hover:scale-105
hover:shadow-[0_10px_30px_rgba(139,69,19,0.35)]
transition-all
">
                          Start Quiz
                        </button>
                      </Link>

                    </div>
                  </div>
                ))}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}