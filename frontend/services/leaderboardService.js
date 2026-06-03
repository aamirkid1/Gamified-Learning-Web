const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const leaderboardService = {
  getLeaderboard: async () => {
    const response = await fetch(
      `${API_URL}/leaderboard`
    );

    return response.json();
  },

  getMyRank: async (userId) => {
    const response = await fetch(
      `${API_URL}/leaderboard/me/${userId}`
    );

    return response.json();
  },
};

export default leaderboardService;