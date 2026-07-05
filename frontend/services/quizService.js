const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/quizzes`;

const quizService = {
  createQuiz: async (data) => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Failed to create quiz"
      );
    }

    return response.json();
  },

  getQuizzes: async () => {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    return response.json();
  },

  getTeacherQuizzes: async (teacherId) => {
    const response = await fetch(
      `${BASE_URL}/teacher/${teacherId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    return response.json();
  },
};

export default quizService;