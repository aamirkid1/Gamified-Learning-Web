const BASE_URL = "http://localhost:3000";

const courseService = {
  // Used by students/public pages
  async getCourses() {
    const response = await fetch(`${BASE_URL}/courses`);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },

  // Used by teachers
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