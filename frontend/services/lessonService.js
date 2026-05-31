const BASE_URL = "http://localhost:3000";

const lessonService = {
  async getLessons() {
    const response = await fetch(`${BASE_URL}/lessons`);

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
      throw new Error("Failed to create lesson");
    }

    return response.json();
  },
};

export default lessonService;