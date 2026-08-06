"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import quizService from "@/services/quizService";
import { 
  BookOpen, 
  FileQuestion, 
  GraduationCap, 
  Sparkles,
  Trophy,
  AlertCircle,
  Check,
  ChevronRight,
  Loader2,
  X
} from "lucide-react";

export default function CreateQuiz() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [passingPercentage, setPassingPercentage] = useState(40);
  const [isRequired, setIsRequired] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadCourses();
    loadLessons();
  }, []);

  const loadCourses = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const res = await fetch(
        `http://localhost:3000/courses/teacher/${user.id}`
      );
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadLessons = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const courseRes = await fetch(
        `http://localhost:3000/courses/teacher/${user.id}`
      );

      const teacherCourses = await courseRes.json();

      let allLessons = [];

      for (const course of teacherCourses) {
        const res = await fetch(
          `http://localhost:3000/lessons/course/${course.id}`
        );

        const lessons = await res.json();

        allLessons.push(...lessons);
      }

      setLessons(allLessons);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate inputs with inline feedback instead of alert()
    if (!title.trim() || !courseId || !lessonId) {
      setErrorMessage("Please fill out all required fields with valid information.");
      return;
    }

    if (
      passingPercentage < 1 ||
      passingPercentage > 100
    ) {
      setErrorMessage("Passing percentage must be between 1 and 100.");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const quiz = await quizService.createQuiz({
        title: title.trim(),
        courseId: Number(courseId),
        lessonId: Number(lessonId),
        teacherId: user.id,
        passingPercentage,
        isRequired,
      });

      // Routes directly forward to question creation workflow
      router.push(`/teacher/create-question/${quiz.id}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrorMessage("Something went wrong while creating the quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resets the selected lesson if the parent course drops or switches
  const handleCourseChange = (e) => {
    setCourseId(e.target.value);
    setLessonId(""); 
  };

  // Helper for difficulty indicator threshold feedback
  const getDifficultyLabel = (pct) => {
    if (pct < 35) return { label: "Casual", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (pct < 60) return { label: "Balanced", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (pct < 80) return { label: "Rigorous", color: "text-orange-600 bg-orange-50 border-orange-200" };
    return { label: "Expert", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const difficulty = getDifficultyLabel(passingPercentage);

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-[#efe5dc] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#eadfd7] overflow-hidden"
      >
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] p-6 sm:p-8 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"
            animate={shouldReduceMotion ? {} : { rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <Sparkles className="w-28 h-28 text-white" />
          </motion.div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl">
              <FileQuestion className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create Quiz
            </h1>
          </div>
          
          <p className="text-white/80 mt-2 text-sm sm:text-base ml-1 sm:ml-12 max-w-lg">
            Build engaging quizzes and track student progression effectively
          </p>
          
          {/* Gamified touch */}
          <motion.div 
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-white/90 mt-4 sm:ml-12 bg-white/10 w-fit px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10"
          >
            <Trophy className="w-4 h-4 text-amber-300 fill-amber-300 flex-shrink-0" />
            <span>Students earn XP upon successful completion</span>
          </motion.div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCreateQuiz} className="p-6 sm:p-8 space-y-6">
          
          {/* Inline Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setErrorMessage("")}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quiz Title Field */}
          <motion.div variants={itemVariants}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileQuestion className="w-4 h-4 text-[#6b1f0f]" />
              Quiz Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Midterm Mastery Check"
              className="w-full border-2 border-gray-200 rounded-2xl p-3.5 sm:p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6b1f0f] focus-visible:ring-4 focus-visible:ring-[#6b1f0f]/10 transition-all duration-200 bg-gray-50/50 focus:bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </motion.div>

          {/* Course & Lesson Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Course Selection Field */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 text-[#6b1f0f]" />
                Course <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 sm:p-4 text-gray-800 focus:outline-none focus:border-[#6b1f0f] focus-visible:ring-4 focus-visible:ring-[#6b1f0f]/10 transition-all duration-200 bg-gray-50/50 focus:bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                value={courseId}
                onChange={handleCourseChange}
                disabled={loading}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Lesson Selection Field */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 text-[#6b1f0f]" />
                Lesson <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full border-2 border-gray-200 rounded-2xl p-3.5 sm:p-4 text-gray-800 focus:outline-none focus:border-[#6b1f0f] focus-visible:ring-4 focus-visible:ring-[#6b1f0f]/10 transition-all duration-200 bg-gray-50/50 focus:bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                disabled={!courseId || loading}
                required
              >
                {!courseId ? (
                  <option value="">Select Course First</option>
                ) : (
                  <>
                    <option value="">Select Lesson</option>
                    {lessons
                      .filter((lesson) => lesson.courseId === Number(courseId))
                      .map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                  </>
                )}
              </select>
            </motion.div>
          </div>

          {/* Signature Motion Moment: Live Interactive Passing Score Gauge */}
          <motion.div variants={itemVariants} className="bg-gray-50/70 border-2 border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Trophy className="w-4 h-4 text-[#6b1f0f]" />
                Passing Percentage
              </label>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="100"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6b1f0f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b1f0f]"
              />
              <div className="flex items-center gap-1 min-w-[70px]">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  disabled={loading}
                  className="w-16 text-center font-bold text-gray-800 border-2 border-gray-200 rounded-xl py-1 px-1 focus:outline-none focus:border-[#6b1f0f] focus-visible:ring-2 focus-visible:ring-[#6b1f0f]/20 bg-white"
                />
                <span className="text-gray-500 font-semibold text-sm">%</span>
              </div>
            </div>

            {/* Live Progress Gauge Visualizer */}
            <div className="space-y-1">
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(passingPercentage, 0), 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                />
              </div>
              <p className="text-xs text-gray-500 pt-1">
                Default passing percentage is 40%. Students must reach this score to succeed.
              </p>
            </div>
          </motion.div>

          {/* Required Quiz Checkbox Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { scale: 1.005 }}
            onClick={() => !loading && setIsRequired(!isRequired)}
            className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-4 sm:p-5 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="space-y-0.5 pr-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-[#6b1f0f] transition-colors">
                Required Quiz
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Student must pass this quiz to mark the lesson as completed.
              </p>
            </div>

            <div className="relative flex items-center justify-center flex-shrink-0">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                disabled={loading}
                className="sr-only"
              />
              <motion.div 
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  isRequired 
                    ? "bg-[#6b1f0f] border-[#6b1f0f]" 
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
                animate={isRequired ? { scale: [0.9, 1] } : { scale: 1 }}
              >
                {isRequired && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </motion.div>
            </div>
          </motion.div>

          {/* Submit Action Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={shouldReduceMotion || loading ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion || loading ? {} : { scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] hover:from-[#58190c] hover:to-[#78321a] text-white py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6b1f0f]/30"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Quiz...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Quiz & Add Questions</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}