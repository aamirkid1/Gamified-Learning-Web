const BASE_URL = "http://localhost:3000";

const courseService = {
  // Student Courses
  async getCourses() {
    const response = await fetch(`${BASE_URL}/courses`);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },

  // Single Course
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
};

export default courseService;