const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const quizAttemptSubmitService = {
  submitAttempt: async (data) => {
    const response = await fetch(
      `${API_URL}/quiz-attempts`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  checkAttempt: async (
    userId,
    quizId
  ) => {
    const response = await fetch(
      `${API_URL}/quiz-attempts/check/${userId}/${quizId}`
    );

    const text =
      await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);
  },
};

export default quizAttemptSubmitService;