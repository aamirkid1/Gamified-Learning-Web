"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

import quizService
from "@/services/quizService";

export default function CreateQuiz() {
  const router = useRouter();

  const [courses,
    setCourses] = useState([]);

  const [lessons,
    setLessons] = useState([]);

  const [title,
    setTitle] = useState("");

  const [courseId,
    setCourseId] = useState("");

  const [lessonId,
    setLessonId] = useState("");

  useEffect(() => {
    loadCourses();
    loadLessons();
  }, []);

  const loadCourses =
    async () => {
      const res =
        await fetch(
          "http://localhost:3000/courses"
        );

      const data =
        await res.json();

      setCourses(data);
    };

  const loadLessons =
    async () => {
      const res =
        await fetch(
          "http://localhost:3000/lessons"
        );

      const data =
        await res.json();

      setLessons(data);
    };

  const handleCreateQuiz =
    async (e) => {
      e.preventDefault();

      const quiz =
        await quizService.createQuiz({
          title,
          courseId:
            Number(courseId),
          lessonId:
            Number(lessonId),
        });

      alert(
        "Quiz Created"
      );

      router.push(
        `/teacher/create-question/${quiz.id}`
      );
    };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-[#6b1f0f] mb-8">
          Create Quiz
        </h1>

        <form
          onSubmit={
            handleCreateQuiz
          }
          className="space-y-5"
        >

          <input
            placeholder="Quiz Title"
            className="w-full border rounded-xl p-4"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <select
            className="w-full border rounded-xl p-4"
            value={courseId}
            onChange={(e) =>
              setCourseId(
                e.target.value
              )
            }
          >
            <option value="">
              Select Course
            </option>

            {courses.map(
              (course) => (
                <option
                  key={course.id}
                  value={
                    course.id
                  }
                >
                  {course.title}
                </option>
              )
            )}
          </select>

          <select
            className="w-full border rounded-xl p-4"
            value={lessonId}
            onChange={(e) =>
              setLessonId(
                e.target.value
              )
            }
          >
            <option value="">
              Select Lesson
            </option>

            {lessons.map(
              (lesson) => (
                <option
                  key={lesson.id}
                  value={
                    lesson.id
                  }
                >
                  {lesson.title}
                </option>
              )
            )}
          </select>

          <button
            className="w-full bg-[#6f311c] text-white py-4 rounded-xl font-semibold"
          >
            Create Quiz
          </button>

        </form>

      </div>

    </div>
  );
}