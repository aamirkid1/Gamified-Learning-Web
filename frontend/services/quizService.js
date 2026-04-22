const API_URL = "http://localhost:5000/api";

export const getQuizzes = async () => {
  const res = await fetch(`${API_URL}/quizzes`);
  return res.json();
};

export const submitQuiz = async (data) => {
  const res = await fetch(`${API_URL}/quizzes/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};