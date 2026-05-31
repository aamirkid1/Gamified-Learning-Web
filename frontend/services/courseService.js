const BASE_URL = "http://localhost:3000";

const courseService = {
  async getCourses() {
    const response = await fetch(`${BASE_URL}/courses`);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },
};

export default courseService;