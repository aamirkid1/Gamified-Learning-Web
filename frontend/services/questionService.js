const BASE_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/questions`;

const questionService = {
  createQuestion: async (data) => {
    const response = await fetch(
      BASE_URL,
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

  getQuestionsByQuiz: async (
    quizId
  ) => {
    const response = await fetch(
      `${BASE_URL}/quiz/${quizId}`
    );

    return response.json();
  },

  

};

export default questionService;