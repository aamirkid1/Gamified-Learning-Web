const BASE_URL = "http://localhost:3000";

const lessonService = {
  async getLessons(courseId, studentId) {
    const response = await fetch(
      `${BASE_URL}/lessons/course/${courseId}/student/${studentId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }

    return response.json();
  },

  async createLesson(data) {
    const response = await fetch(`${BASE_URL}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to create lesson"
      );
    }

    return response.json();
  },

  async getTeacherLessons(courseId) {
    const response = await fetch(
      `${BASE_URL}/lessons/course/${courseId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }

    return response.json();
  },

  async getTeacherLessonAnalytics(courseId) {
    const response = await fetch(
      `${BASE_URL}/lessons/course/${courseId}/analytics`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lesson analytics");
    }

    return response.json();
  },
};

export default lessonService;