const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const quizAttemptService = {
  getQuiz: async (quizId) => {
    const res = await fetch(
      `${API_URL}/quizzes/${quizId}`
    );

    return res.json();
  },

  getQuestions: async (quizId) => {
    const res = await fetch(
      `${API_URL}/questions/quiz/${quizId}`
    );

    return res.json();
  },
};

export default quizAttemptService;