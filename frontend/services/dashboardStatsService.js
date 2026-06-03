// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL;

// const dashboardStatsService = {
//   getMyRank: async (userId) => {
//     const response = await fetch(
//       `${API_URL}/leaderboard/me/${userId}`
//     );

//     return response.json();
//   },
// };

// export default dashboardStatsService;


import leaderboardService from "./leaderboardService";

const dashboardStatsService = {
  getMyRank: async (userId) => {
    return leaderboardService.getMyRank(
      userId
    );
  },
};

export default dashboardStatsService;