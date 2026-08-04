"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import quizService from "@/services/quizService";
import { 
  BookOpen, 
  FileQuestion, 
  GraduationCap, 
  Sparkles,
  Trophy
} from "lucide-react";

export default function CreateQuiz() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  
const [title, setTitle] = useState("");
const [courseId, setCourseId] = useState("");
const [lessonId, setLessonId] = useState("");

const [passingPercentage, setPassingPercentage] =
  useState(40);

const [isRequired, setIsRequired] =
  useState(true);

const [loading, setLoading] = useState(false);

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

    // 2. Prevent creating quizzes with only spaces
    if (!title.trim() || !courseId || !lessonId) {
      alert("Please fill out all fields with valid information.");
      return;
    }

    if (
  passingPercentage < 1 ||
  passingPercentage > 100
) {
  alert(
    "Passing percentage must be between 1 and 100."
  );
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
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resets the selected lesson if the parent course drops or switches
  const handleCourseChange = (e) => {
    setCourseId(e.target.value);
    setLessonId(""); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-[#efe5dc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#eadfd7] overflow-hidden transition-all duration-300 hover:-translate-y-1">
        
        {/* Header Section with Gamified Badge */}
        <div className="bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] px-8 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-white" />
          </div>
          <div className="flex items-center gap-3">
            <FileQuestion className="w-9 h-9 text-white" />
            <h1 className="text-4xl font-bold text-white">
              Create Quiz
            </h1>
          </div>
          <p className="text-white/80 mt-2 ml-12">
            Create engaging quizzes for your students
          </p>
          
          {/* Gamified touch */}
          <div className="flex items-center gap-2 text-sm text-white/90 mt-4 ml-12 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Create quizzes and help students earn XP</span>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCreateQuiz} className="p-8 space-y-6">
          
          {/* Quiz Title Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileQuestion className="w-4 h-4 text-[#6b1f0f]" />
              Quiz Title
            </label>
            <input
              type="text"
              placeholder="Enter quiz title..."
              className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Course Selection Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 text-[#6b1f0f]" />
              Course
            </label>
            <select
              className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white cursor-pointer"
              value={courseId}
              onChange={handleCourseChange}
              required
              disabled={loading}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Selection Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 text-[#6b1f0f]" />
              Lesson
            </label>
            <select
              className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              required
              disabled={!courseId || loading}
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
          </div>


          {/* Passing Percentage */}
<div>
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
    <Trophy className="w-4 h-4 text-[#6b1f0f]" />
    Passing Percentage
  </label>

  <input
    type="number"
    min={1}
    max={100}
    value={passingPercentage}
    onChange={(e) =>
      setPassingPercentage(
        Number(e.target.value)
      )
    }
    className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-[#6b1f0f] focus:ring-4 focus:ring-[#6b1f0f]/10 transition-all duration-300 bg-gray-50/50 focus:bg-white"
  />

  <p className="text-xs text-gray-500 mt-2">
    Default passing percentage is 40%.
  </p>
</div>


{/* Required Quiz */}
<div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-4">

  <div>
    <h3 className="font-semibold text-gray-800">
      Required Quiz
    </h3>

    <p className="text-sm text-gray-500">
      Student must pass this quiz to complete the lesson.
    </p>
  </div>

  <input
    type="checkbox"
    checked={isRequired}
    onChange={(e) =>
      setIsRequired(e.target.checked)
    }
    className="w-5 h-5 accent-[#6b1f0f]"
  />

</div>


{/* Required Quiz */}
<div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-4">

  <div>
    <h3 className="font-semibold text-gray-800">
      Required Quiz
    </h3>

    <p className="text-sm text-gray-500">
      Student must pass this quiz to complete the lesson.
    </p>
  </div>

  <input
    type="checkbox"
    checked={isRequired}
    onChange={(e) =>
      setIsRequired(e.target.checked)
    }
    className="w-5 h-5 accent-[#6b1f0f]"
  />

</div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-[#6b1f0f] to-[#8a3b20] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Quiz...</span>
              </div>
            ) : (
              "Create Quiz"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}