const API =
  "http://localhost:3000";

const reviewAnswerService = {
  async getPending() {
    const res = await fetch(
      `${API}/quiz-attempts/pending`
    );

    return res.json();
  },

  async review(
    attemptId,
    score
  ) {
    const res = await fetch(
      `${API}/quiz-attempts/review/${attemptId}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          score,
        }),
      }
    );

    return res.json();
  },
};

export default reviewAnswerService;