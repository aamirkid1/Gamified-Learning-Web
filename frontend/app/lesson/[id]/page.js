"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Video,
  FileText,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  Volume2,
  Sparkles,
  Home,
  ChevronRight,
  Gauge,
  Trophy,
  Clock,
  Layers,
  Flame,
  Lock,
} from "lucide-react";

export default function LessonPage() {
  const params = useParams();
const [lesson, setLesson] = useState(null);
const [loading, setLoading] = useState(true);

const [lessonStatus, setLessonStatus] = useState({
  completed: false,
  locked: false,
});

const [courseLessons, setCourseLessons] = useState([]);
const [courseInfo, setCourseInfo] = useState(null);
  useEffect(() => {
    loadLesson();
  }, []);

  useEffect(() => {
    if (lesson?.courseId) {
      loadCourseInfo();
    }
  }, [lesson?.courseId]);

  const loadLesson = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    /*
     * First load the current lesson
     */
    const lessonResponse = await fetch(
      "http://localhost:3000/lessons"
    );

    const allLessons =
      await lessonResponse.json();

    const foundLesson =
      allLessons.find(
        (l) => l.id === Number(params.id)
      );

    if (!foundLesson) {
      setLoading(false);
      return;
    }

    setLesson(foundLesson);

    /*
     * Now load lesson progression
     */
    const progressResponse =
      await fetch(
        `http://localhost:3000/lessons/course/${foundLesson.courseId}/student/${user.id}`
      );

    const lessonProgress =
      await progressResponse.json();

    setCourseLessons(
      lessonProgress,
    );

    const currentLesson =
      lessonProgress.find(
        (lesson) =>
          lesson.id === foundLesson.id
      );

    if (currentLesson) {
      setLessonStatus({
        completed:
          currentLesson.completed,

        locked:
          currentLesson.locked,
      });
    }
  } catch (error) {
    console.error(
      "Error loading lesson:",
      error,
    );
  } finally {
    setLoading(false);
  }
};

  const loadCourseInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${lesson.courseId}`
      );
      const data = await response.json();
      setCourseInfo(data);
    } catch (error) {
      console.error("Error loading course info:", error);
    }
  };

  
  // Splits lecture text into sentences (falls back to the whole text) so each
  // one can receive its own subtle hover glow. Newlines are preserved inside
  // the matched chunks so whitespace-pre-line still renders them correctly.
  const splitIntoSentences = (text) => {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g);
    return matches && matches.length > 0 ? matches : [text];
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b4513] to-[#6b1f0f] flex items-center justify-center shadow-lg animate-pulse">
            <BookOpen size={26} className="text-white" />
          </div>
          <p className="text-gray-400 font-semibold text-sm tracking-wide animate-pulse">
            Syncing lecture terminal parameters...
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 text-center border border-[#eaded4] shadow-xl max-w-md mx-auto mt-12 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="text-[#6f311c] opacity-60" size={30} />
        </div>
        <h3 className="text-lg font-bold text-[#3b130d]">Lecture node missing</h3>
        <p className="text-gray-500 text-sm mt-1">This specific material chunk could not be fetched.</p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8b4513] to-[#6b1f0f] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  // ---- Derived values (all computed from real fetched data, nothing fabricated) ----
  const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id);
  const totalLessons = courseLessons.length;
  const lessonNumber = currentIndex >= 0 ? currentIndex + 1 : 1;
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < totalLessons - 1
      ? courseLessons[currentIndex + 1]
      : null;
  const progressPercent =
    totalLessons > 0 ? Math.round((lessonNumber / totalLessons) * 100) : 0;

  const wordCount = lesson.content
    ? lesson.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const xpReward = 50;

  return (
    <div className="relative space-y-8 font-sans text-gray-800">

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#8b4513]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-[#a0522d]/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-[#6b1f0f]/5 blur-[100px] rounded-full" />
      </div>

      {/* ============================================================ */}
      {/* PREMIUM STICKY NAVIGATION                                     */}
      {/* ============================================================ */}
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
py-4
space-y-3
"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href={`/courses/${lesson.courseId || ""}`}
            className="group inline-flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full bg-gradient-to-r from-[#8b4513] to-[#6b1f0f] text-white font-semibold text-sm shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Course</span>
          </Link>

          {/* BREADCRUMB */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Home size={13} className="flex-shrink-0" />
            <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
            <Link
              href={`/courses/${lesson.courseId || ""}`}
              className="hover:text-[#8b4513] transition-colors duration-300 max-w-[140px] truncate"
            >
              {courseInfo?.title || "Course"}
            </Link>
            <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
            <span className="font-semibold text-[#3b130d] truncate max-w-[160px]">
              {lesson.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {prevLesson ? (
              <Link
                href={`/lesson/${prevLesson.id}`}
                title="Previous Lesson"
                className="w-10 h-10 rounded-2xl bg-white/70 border border-[#eaded4] shadow-sm flex items-center justify-center text-[#8b4513] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                <ArrowLeft size={16} />
              </Link>
            ) : (
              <span className="w-10 h-10 rounded-2xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-300 cursor-not-allowed">
                <ArrowLeft size={16} />
              </span>
            )}

            <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513] bg-[#f5f1ed] border border-[#eaded4] px-3 py-2 rounded-full">
              Lesson {lessonNumber}{totalLessons ? ` / ${totalLessons}` : ""}
            </span>

            {nextLesson ? (
  nextLesson.locked ? (
    <button
      onClick={() =>
        alert("Complete and pass the current lesson quiz to unlock the next lesson.")
      }
      className="w-10 h-10 rounded-2xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-300 cursor-not-allowed"
    >
      <ArrowRight size={16} />
    </button>
  ) : (
    <Link
      href={`/lesson/${nextLesson.id}`}
      title="Next Lesson"
      className="w-10 h-10 rounded-2xl bg-white/70 border border-[#eaded4] shadow-sm flex items-center justify-center text-[#8b4513] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
    >
      <ArrowRight size={16} />
    </Link>
  )
) : (
  <span className="w-10 h-10 rounded-2xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-300 cursor-not-allowed">
    <ArrowRight size={16} />
  </span>
)}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PREMIUM LESSON HERO                                           */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4b1d12] via-[#6b1f0f] to-[#8b4513] text-white shadow-2xl shadow-black/30 border border-white/10 p-6 md:p-10">

        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />

        <div className="relative space-y-6">

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-sm">
              <Sparkles size={13} className="text-white/90" />
              Module {lessonNumber}
            </div>

            {courseInfo?.title && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10 text-gray-200/90">
                <BookOpen size={13} />
                {courseInfo.title}
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/10 text-gray-200/90">
              <Gauge size={13} />
              Beginner
            </div>

           {lessonStatus.completed && (
  <span className="inline-flex items-center gap-1.5 bg-emerald-400/15 text-emerald-200 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-300/30 backdrop-blur-md shadow-sm">
    <CheckCircle2 size={14} />
    Completed
  </span>
)}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            {lesson.title}
          </h1>

          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-sm">
              <Trophy size={16} className="text-amber-200" />
              <span className="text-sm font-bold">+{xpReward} XP</span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-sm">
              <Clock size={16} className="text-gray-200" />
              <span className="text-sm font-bold">~{readingMinutes} min read</span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-sm">
              <Layers size={16} className="text-gray-200" />
              <span className="text-sm font-bold">Lesson {lessonNumber} of {totalLessons || 1}</span>
            </div>
          </div>

          {/* LESSON PROGRESS BAR */}
          <div className="pt-2 max-w-xl">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-300 mb-1.5">
              <span>Course Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* LESSON STATISTICS                                             */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { key: "lesson", label: "Lesson", value: lessonNumber, icon: Layers },
          { key: "total", label: "Course Lessons", value: totalLessons || 1, icon: BookOpen },
          { key: "duration", label: "Duration", value: `${readingMinutes} min`, icon: Clock },
          { key: "xp", label: "XP Reward", value: `+${xpReward}`, icon: Trophy },
        ].map(({ key, label, value, icon: Icon }) => (
          <div
            key={key}
            className="
bg-white/70
backdrop-blur-xl
rounded-2xl
border
border-[#eaded4]
shadow-sm
p-5
sm:p-6
flex
flex-col
items-center
justify-center
gap-2
text-center
transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
hover:scale-105
"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8b4513] to-[#6b1f0f] flex items-center justify-center shadow-md mb-1">
              <Icon size={20} className="text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#3b130d] leading-none">
              {value}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN STUDY DOCK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT COLUMN: LECTURE TEXT & PROGRESS CONSOLE */}
        <div className="lg:col-span-2 space-y-6">

          {/* LECTURE TERMINAL NOTE BLOCK */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pl-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6f311c]">
                Lecture Notes
              </h3>
              <button className="text-xs font-semibold text-[#8b4513] hover:text-[#6b1f0f] flex items-center gap-1.5 transition-all duration-300 bg-white/70 backdrop-blur-md border border-[#eaded4] px-3 py-1.5 rounded-full shadow-sm hover:-translate-y-0.5 hover:shadow-md">
                <Volume2 size={14} /> Listen to Audio
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-[#eaded4] min-h-[220px] relative flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                {lesson.content
                  ? splitIntoSentences(lesson.content).map((sentence, idx) => (
                      <span
                        key={idx}
                        className="transition-all duration-300 ease-out hover:text-[#3b130d] hover:bg-[#8b4513]/10 hover:[text-shadow:0_0_8px_rgba(139,69,19,0.25)] rounded-sm"
                      >
                        {sentence}
                      </span>
                    ))
                  : "No textual definitions compiled for this dynamic curriculum node track."}
              </p>

              <div className="border-t border-dashed border-[#eaded4] pt-4 mt-6 flex flex-wrap justify-between items-center gap-2 text-xs text-gray-400 font-medium">
                <span>Estimated reading duration: ~{readingMinutes} min</span>
                <span>Updated recently</span>
                <span>ID: #{lesson.id}</span>
              </div>
            </div>
          </div>

          {/* GAMEPLAY COMPLETION / REWARD CARD */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl border border-[#eaded4] transition-all duration-300 hover:shadow-2xl">
            {!lessonStatus?.completed ? (
              <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-lg font-bold text-[#3b130d]">Finished reading the lecture notes?</h4>
                    <p className="text-gray-500 text-xs font-medium">Mark this lesson complete to unlock your rewards instantly.</p>
                  </div>
                  <div className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 text-gray-500 font-bold text-sm text-center">
  Complete the quiz to unlock the next lesson
</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-dashed border-[#eaded4]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 pt-4">
                    <Trophy size={14} className="text-[#8b4513]" /> +{xpReward} XP Reward
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 pt-4">
                    <Lock size={14} className="text-[#8b4513]" /> Unlock Next Lesson
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 pt-4">
                    <Flame size={14} className="text-[#8b4513]" /> Maintain Learning Streak
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#4b1d12] via-[#6b1f0f] to-[#8b4513] text-white p-6 md:p-8 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xl font-black flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles size={18} className="text-amber-200" />
                      Congratulations!
                    </h4>
                    <p className="text-gray-200/90 text-sm font-medium">
                      You've earned +{xpReward} XP and kept your learning streak alive.
                    </p>
                  </div>

                  {nextLesson ? (
  nextLesson.locked ? (
    <button
      onClick={() =>
        alert("Complete and pass the current lesson quiz to unlock the next lesson.")
      }
      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-400 text-white font-bold cursor-not-allowed"
    >
      Next Lesson Locked
    </button>
  ) : (
    <Link
      href={`/lesson/${nextLesson.id}`}
      className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm bg-white text-[#6b1f0f]"
    >
      Next Lesson
    </Link>
  )
) : (
  <Link
    href={`/courses/${lesson.courseId}`}
    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-[#6b1f0f] font-bold"
  >
    Back to Course
  </Link>
)}
                </div>
              </div>
            )}
          </div>

          {/* PREVIOUS / NEXT LESSON NAVIGATION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevLesson ? (
              <Link
                href={`/lesson/${prevLesson.id}`}
                className="group bg-white/70 backdrop-blur-xl border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-[#8b4513] group-hover:bg-[#8b4513] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  <ArrowLeft size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Previous Lesson</p>
                  <h5 className="text-sm font-bold text-[#3b130d] truncate">{prevLesson.title}</h5>
                </div>
              </Link>
            ) : (
              <div className="bg-white/50 border border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-4 opacity-70">
                <div className="w-11 h-11 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-300 flex-shrink-0">
                  <ArrowLeft size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Previous Lesson</p>
                  <h5 className="text-sm font-bold text-gray-400">This is the first lesson</h5>
                </div>
              </div>
            )}

            {nextLesson ? (
  nextLesson.locked ? (
    <div
      onClick={() =>
        alert("Complete and pass the current lesson quiz to unlock the next lesson.")
      }
      className="cursor-not-allowed bg-gray-100 border border-[#eaded4] rounded-2xl p-5 flex items-center justify-end gap-4 text-right opacity-70"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Next Lesson
        </p>

        <h5 className="text-sm font-bold text-gray-400">
          {nextLesson.title}
        </h5>

        <p className="text-xs text-red-500">
          Locked
        </p>
      </div>

      <div className="w-11 h-11 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-400">
        <Lock size={18} />
      </div>
    </div>
  ) : (
    <Link
      href={`/lesson/${nextLesson.id}`}
      className="group bg-white/70 backdrop-blur-xl border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-end gap-4 text-right"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Next Lesson
        </p>

        <h5 className="text-sm font-bold text-[#3b130d]">
          {nextLesson.title}
        </h5>
      </div>

      <div className="w-11 h-11 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-[#8b4513]">
        <ArrowRight size={18} />
      </div>
    </Link>
  )
) : (
  <div className="bg-white/50 border border-dashed border-gray-200 rounded-2xl p-5 flex items-center justify-end gap-4 opacity-70 text-right">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        Next Lesson
      </p>

      <h5 className="text-sm font-bold text-gray-400">
        This is the last lesson
      </h5>
    </div>

    <div className="w-11 h-11 rounded-xl bg-[#f5f1ed] border border-[#eaded4] flex items-center justify-center text-gray-300">
      <ArrowRight size={18} />
    </div>
  </div>
)}
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE MEDIA LINKS TERMINAL */}
        <div className="space-y-6">

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6f311c] pl-1">
              Attached Materials
            </h3>

            <div className="space-y-4">
              {/* VIDEO MATERIAL CONTAINER BUTTON */}
              {lesson.videoUrl ? (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block bg-white/70 backdrop-blur-xl border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#8b4513]/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 group-hover:bg-[#8b4513] group-hover:text-white group-hover:border-[#8b4513] transition-colors duration-300">
                        <Video size={22} className="group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#3b130d] tracking-tight">
                          Video Presentation
                        </h4>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                          Watch dynamic stream presentation
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-gray-400 group-hover:text-[#8b4513] transition-colors duration-300" />
                  </div>
                </a>
              ) : (
                <div className="bg-white/70 backdrop-blur-xl border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs font-medium text-gray-400">
                  No streaming video attached
                </div>
              )}

              {/* PDF MATERIAL CONTAINER BUTTON */}
              {lesson.pdfUrl ? (
                <a
                  href={lesson.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block bg-white/70 backdrop-blur-xl border border-[#eaded4] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#8b4513]/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#8b4513] flex-shrink-0 group-hover:bg-[#6f311c] group-hover:text-white group-hover:border-[#6f311c] transition-colors duration-300">
                        <FileText size={22} className="group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#3b130d] tracking-tight">
                          Worksheet PDF Notes
                        </h4>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                          Download documentation vault
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-gray-400 group-hover:text-[#6f311c] transition-colors duration-300" />
                  </div>
                </a>
              ) : (
                <div className="bg-white/70 backdrop-blur-xl border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs font-medium text-gray-400">
                  No lecture documentation sheets attached
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}