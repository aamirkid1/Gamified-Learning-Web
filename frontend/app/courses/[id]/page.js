"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Play,
  ArrowLeft,
  HelpCircle,
  Home,
  ChevronRight,
  Bookmark,
  Share2,
  MoreVertical,
  Lock,
  CheckCircle,
} from "lucide-react";
import enrollmentService from "@/services/enrollmentService";
import CourseHero from "@/components/course/CourseHero";
import TeacherCard from "@/components/course/TeacherCard";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import EnrollmentCard from "@/components/course/EnrollmentCard";
import StickyEnrollmentCard from "@/components/course/StickyEnrollmentCard";
import CourseOverview from "@/components/course/CourseOverview";

export default function CourseDetails() {
  const params = useParams();

  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [course, setCourse] = useState(null);
  const [studentCount, setStudentCount] = useState(0);

  // UI-only state for the premium action bar
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [lockedModal, setLockedModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    loadCourse();
    loadQuizzes();
    loadStudentCount();

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      loadLessons(parsedUser.id);
    } else {
      loadLessons();
    }
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
      loadStudentCount();
    } catch (error) {
      console.error(error);
    }
  };

  const loadLessons = async (studentId = null) => {
    try {
      let url;

      if (studentId) {
        url = `http://localhost:3000/lessons/course/${params.id}/student/${studentId}`;
      } else {
        url = `http://localhost:3000/lessons/course/${params.id}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setLessons(data);
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${params.id}`
      );

      const data = await response.json();

      setCourse(data);
    } catch (error) {
      console.error("Error loading course:", error);
    }
  };

  const loadQuizzes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/quizzes"
      );

      const data = await response.json();

      const filteredQuizzes = data.filter(
        (quiz) => quiz.courseId === Number(params.id)
      );

      setQuizzes(filteredQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  };


  const loadStudentCount = async () => {
    try {
      const data =
        await enrollmentService.getEnrollmentCount(
          params.id
        );

      setStudentCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Premium action bar handlers (UI only, no backend calls) ----

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    const shareData = {
      title: course?.title || "Course",
      text: "Check out this course",
      url: getShareUrl(),
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Course link copied!");
      }
    } catch (error) {
      console.error("Error sharing course:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(getShareUrl());
        alert("Course link copied!");
      }
    } catch (error) {
      console.error("Error copying link:", error);
    } finally {
      setShowMoreMenu(false);
    }
  };

  const handleOpenNewTab = () => {
    if (typeof window !== "undefined") {
      window.open(getShareUrl(), "_blank");
    }
    setShowMoreMenu(false);
  };

  const handleReportCourse = () => {
    // Placeholder action only — no backend wired up yet.
    console.log("Report course clicked for course:", params.id);
    setShowMoreMenu(false);
  };

  return (
    <div className="relative space-y-10 font-sans">

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

      {/* ============================================================ */}
      {/* PREMIUM BREADCRUMB + ACTION BAR                               */}
      {/* ============================================================ */}
      <div className="space-y-4 mb-8">

        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 hover:text-[#8b4513] transition-colors duration-300"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </Link>

          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />

          <Link
            href="/courses"
            className="hover:text-[#8b4513] transition-colors duration-300"
          >
            Courses
          </Link>

          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />

          <span className="font-semibold text-[#3b130d] truncate max-w-[200px] sm:max-w-xs">
            {course?.title || "Course"}
          </span>
        </nav>

        {/* PREMIUM ACTION BAR */}
        <div
          className="
sticky
top-20
z-40
bg-white/70
backdrop-blur-xl
rounded-3xl
shadow-xl
border
border-[#eaded4]
px-6
py-5
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4
"
        >
          {/* PREMIUM BACK BUTTON */}
          <Link
            href="/courses"
            className="
group
inline-flex
items-center
gap-2
w-fit
pl-4
pr-5
py-2.5
rounded-full
bg-gradient-to-r
from-[#8b4513]
to-[#6b1f0f]
text-white
font-semibold
shadow-md
hover:scale-105
hover:shadow-xl
transition-all
duration-300
"
          >
            <ArrowLeft
              size={16}
              className="transform group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span>Back to Courses</span>
          </Link>

          {/* SAVE / SHARE / MORE */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* WISHLIST BUTTON */}
            <button
              type="button"
              onClick={() => setIsWishlisted((prev) => !prev)}
              title={isWishlisted ? "Saved" : "Save course"}
              className="
w-11
h-11
rounded-2xl
bg-white/70
backdrop-blur-md
border
border-[#eaded4]
shadow-sm
flex
items-center
justify-center
text-[#8b4513]
hover:-translate-y-2
hover:scale-[1.01]
hover:shadow-xl
transition-all
duration-300
"
            >
              <Bookmark
                size={18}
                className={isWishlisted ? "fill-current" : ""}
              />
            </button>

            {/* SHARE BUTTON */}
            <button
              type="button"
              onClick={handleShare}
              title="Share course"
              className="
w-11
h-11
rounded-2xl
bg-white/70
backdrop-blur-md
border
border-[#eaded4]
shadow-sm
flex
items-center
justify-center
text-[#8b4513]
hover:-translate-y-2
hover:scale-[1.01]
hover:shadow-xl
transition-all
duration-300
"
            >
              <Share2 size={18} />
            </button>

            {/* MORE BUTTON */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreMenu((prev) => !prev)}
                title="More options"
                className="
w-11
h-11
rounded-2xl
bg-white/70
backdrop-blur-md
border
border-[#eaded4]
shadow-sm
flex
items-center
justify-center
text-[#8b4513]
hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300
"
              >
                <MoreVertical size={18} />
              </button>

              {showMoreMenu && (
                <div
                  className="
absolute
right-0
mt-2
w-52
bg-white
rounded-2xl
shadow-xl
border
border-[#eaded4]
py-2
z-50
"
                >
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#3b130d] hover:bg-[#f5f1ed] transition-colors duration-300"
                  >
                    Copy Link
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenNewTab}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#3b130d] hover:bg-[#f5f1ed] transition-colors duration-300"
                  >
                    Open in New Tab
                  </button>

                  <button
                    type="button"
                    onClick={handleReportCourse}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
                  >
                    Report Course
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {course && (
        <>
          <CourseHero
            course={course}
            lessonsCount={lessons.length}
            quizzesCount={quizzes.length}
            studentCount={studentCount}
          />

          <TeacherCard teacher={course.teacher} />

          <CourseOverview course={course} />
        </>
      )}

      <CourseCurriculum
        lessons={lessons}
        isEnrolled={isEnrolled}
      />

      <div className="grid lg:grid-cols-3 gap-10 mt-10">

        {/* LEFT */}

        <div className="lg:col-span-2">

          {/* LESSONS WILL STAY HERE */}


          {/* LESSONS */}

          {isEnrolled ? (
            loading ? (
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
              <div
  className="
    max-w-4xl
    mx-auto
    space-y-6
    relative
    before:absolute
    before:top-4
    before:bottom-4
    before:left-[31px]
    before:w-1
    before:rounded-full
    before:bg-gradient-to-b
    before:from-green-500
    before:via-[#8b4513]
    before:to-[#eaded4]
  "
>

                {lessons.map((lesson, index) => {



                  // const lessonQuiz = quizzes.find(
                  //   (quiz) => quiz.lessonId === lesson.id
                  // );

                  const lessonQuizzes = quizzes.filter(
                    (quiz) => quiz.lessonId === lesson.id
                  );

                  const isCompleted = lesson.completed;
                  const isLocked = lesson.locked;
                  const isCurrent = !isLocked && !isCompleted;

                  return (
                    <div
  key={lesson.id}
  className="relative"
>

  {/* {index !== lessons.length - 1 && (
  <div
    className={`
      absolute
      left-8
      top-20
      w-1
      h-[95px]
      rounded-full

      ${
        isCompleted
          ? "bg-green-400"
          : "bg-[#eaded4]"
      }
    `}
  />
)} */}

                      <Link
                        href={
                          lesson.locked
                            ? "#"
                            : `/lesson/${lesson.id}`
                        }
                        onClick={(e) => {
  if (lesson.locked) {
    e.preventDefault();
    setLockedModal(true);
  }
}}
                        className="block group"
                      >
                        <div
                          className={`
    p-5
    flex
    items-center
    gap-5
    rounded-3xl
    transition-all
    duration-300
    relative
    z-10
    border

    ${isCompleted
                              ? "bg-green-50 border-green-300 shadow-md"
                              : isCurrent
                                ? "bg-white border-[#8b4513] shadow-xl ring-2 ring-[#8b4513]/20"
                                : "bg-gray-50 border-gray-200 opacity-70"
                            }

    hover:shadow-2xl
    hover:shadow-[0_10px_40px_rgba(139,69,19,0.15)]
    hover:-translate-y-2
hover:scale-[1.01]
  `}
                        >

                          {/* MODULE NODE */}
                          <div
                            className={`
    w-16
    h-16
    rounded-2xl
    flex
    flex-col
    items-center
    justify-center
    shadow-md
    transition-all

    ${isCompleted
                                ? "bg-gradient-to-br from-green-500 to-green-700"
                                : isCurrent
                                  ? "bg-gradient-to-br from-[#8b4513] to-[#6b1f0f]"
                                  : "bg-gradient-to-br from-gray-400 to-gray-500"
                              }
  `}
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

                              <div className="flex items-center gap-3 flex-wrap">

                                <h2
                                  className={`
      text-lg
      font-bold
      tracking-tight
      transition-colors
      line-clamp-1

      ${isCompleted
                                      ? "text-green-700"
                                      : isCurrent
                                        ? "text-[#3b130d]"
                                        : "text-gray-500"
                                    }
    `}
                                >
                                  {lesson.title}
                                </h2>

                                {isCompleted ? (
                                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                                    Completed
                                  </span>
                                ) : isCurrent ? (
                                  <span className="px-2 py-1 rounded-full bg-[#8b4513]/10 text-[#8b4513] text-[10px] font-bold uppercase">
                                    Current
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold uppercase">
                                    Locked
                                  </span>
                                )}

                              </div>

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

                          <div
                            className={`
    w-10
    h-10
    rounded-full
    flex
    items-center
    justify-center
    flex-shrink-0
    border
    transition-all
    duration-300
    shadow-sm

    ${isCompleted
                                ? "bg-green-600 border-green-600 text-white"
                                : isCurrent
                                  ? "bg-[#8b4513] border-[#8b4513] text-white"
                                  : "bg-gray-200 border-gray-300 text-gray-400"
                              }
  `}
                          >
                            {isCompleted ? (
                              <CheckCircle size={18} />
                            ) : isLocked ? (
                              <Lock size={16} />
                            ) : (
                              <Play size={14} className="fill-current ml-0.5" />
                            )}
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

                      {lessonQuizzes.map((quiz, quizIndex) => {
  const quizCompleted = quiz.completed;
  const quizLocked = lesson.locked;

  return (
    <div
      key={quiz.id}
      className={`
        ml-0
        md:ml-20
        mt-5
        rounded-3xl
        border
        p-6
        transition-all
        duration-300
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1

        ${
          quizCompleted
            ? "bg-green-50 border-green-300"
            : quizLocked
            ? "bg-gray-50 border-gray-200 opacity-70"
            : "bg-gradient-to-r from-[#fff8e6] via-[#fffdf8] to-white border-[#f0d88c]"
        }
      `}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* LEFT SIDE */}
        <div className="flex items-start gap-4">

          {/* QUIZ BADGE */}
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              text-white
              font-black
              shadow-md

              ${
                quizCompleted
                  ? "bg-green-600"
                  : quizLocked
                  ? "bg-gray-400"
                  : "bg-gradient-to-br from-amber-400 to-amber-500"
              }
            `}
          >
            Q{quizIndex + 1}
          </div>

          {/* QUIZ DETAILS */}
          <div>

            <p
              className={`
                text-xs
                font-bold
                uppercase
                tracking-widest

                ${
                  quizCompleted
                    ? "text-green-700"
                    : quizLocked
                    ? "text-gray-400"
                    : "text-amber-700"
                }
              `}
            >
              {quizCompleted
                ? "Quiz Completed"
                : quizLocked
                ? "Quiz Locked"
                : "Quiz Challenge"}
            </p>

            <h3
              className={`
                mt-1
                text-xl
                font-bold

                ${
                  quizCompleted
                    ? "text-green-700"
                    : quizLocked
                    ? "text-gray-500"
                    : "text-[#3b130d]"
                }
              `}
            >
              {quiz.title}
            </h3>

            {/* STATUS BADGE */}
            <div className="mt-3">

              <span
                className={`
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-bold

                  ${
                    quizCompleted
                      ? "bg-green-100 text-green-700"
                      : quizLocked
                      ? "bg-gray-200 text-gray-500"
                      : "bg-amber-100 text-amber-700"
                  }
                `}
              >
                {quizCompleted
                  ? "Completed"
                  : quizLocked
                  ? "Locked"
                  : "Ready to Attempt"}
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE BUTTON */}
        {quizCompleted ? (
          <div className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-md">
            <CheckCircle size={18} />
            Completed
          </div>
        ) : quizLocked ? (
          <div className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-2xl font-bold">
            <Lock size={18} />
            Locked
          </div>
        ) : (
          <Link href={`/quiz/${quiz.id}`}>
            <button
              className="
                px-8
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-[#8b4513]
                to-[#a0522d]
                text-white
                font-bold
                shadow-lg
                hover:scale-105
                hover:shadow-[0_15px_35px_rgba(139,69,19,0.35)]
                transition-all
                duration-300
              "
            >
              Start Quiz →
            </button>
          </Link>
        )}

      </div>
    </div>
  );
})}
                    </div>
                  );
                })}

              </div>
            )
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-[#d8c6b8] bg-[#f9f5f1] p-10 text-center">
              <h3 className="text-2xl font-bold text-[#3b130d]">
                Course Content Locked
              </h3>

              <p className="mt-3 text-gray-600">
                Enroll in this course to access lessons, videos, quizzes and
                flashcards.
              </p>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR */}

        <div>

          <StickyEnrollmentCard
            course={course}
            lessons={lessons}
            quizzes={quizzes}
            studentCount={studentCount}
            isEnrolled={isEnrolled}
            handleEnroll={handleEnroll}
          />

        </div>

            </div>

      {lockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

            <div className="w-20 h-20 rounded-full bg-[#f5f1ed] flex items-center justify-center mx-auto">
              <Lock size={38} className="text-[#8b4513]" />
            </div>

            <h2 className="mt-6 text-2xl font-black text-center text-[#3b130d]">
              Lesson Locked
            </h2>

            <p className="mt-4 text-center text-gray-600 leading-7">
              Complete the previous lesson and pass its quiz
              to unlock this lesson.
            </p>

            <button
              onClick={() => setLockedModal(false)}
              className="mt-8 w-full bg-[#8b4513] hover:bg-[#6b1f0f] text-white font-bold py-3 rounded-xl transition"
            >
              Got it
            </button>

          </div>

        </div>
      )}

    </div>

  );
}