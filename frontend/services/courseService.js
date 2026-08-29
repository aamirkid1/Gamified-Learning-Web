import { API_URL } from "@/lib/api";

const BASE_URL = API_URL;

const courseService = {
  // Student Courses
  async getCourses() {
    const response = await fetch(`${BASE_URL}/courses`);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },

  // Student Course Details
  async getCourse(courseId) {
    const response = await fetch(
      `${BASE_URL}/courses/${courseId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }

    return response.json();
  },

  // Teacher Courses
  async getTeacherCourses(teacherId) {
    const response = await fetch(
      `${BASE_URL}/courses/teacher/${teacherId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teacher courses");
    }

    return response.json();
  },

  // Teacher Course Details
  async getTeacherCourseDetails(courseId) {
    const response = await fetch(
      `${BASE_URL}/courses/details/${courseId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }

    return response.json();
  },
};

export default courseService;