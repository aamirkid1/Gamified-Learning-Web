import { API_URL } from "@/lib/api";

const API = API_URL;

const reviewAnswerService = {
  async getPending(teacherId) {
    const res = await fetch(
      `${API}/quiz-attempts/pending/${teacherId}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch pending answers");
    }

    return res.json();
  },

  async review(attemptId, score) {
    const res = await fetch(
      `${API}/quiz-attempts/review/${attemptId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to review attempt");
    }

    return res.json();
  },

  async getQuestion(questionId) {
    const res = await fetch(
      `${API}/questions/${questionId}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch question");
    }

    return res.json();
  },
};

export default reviewAnswerService;