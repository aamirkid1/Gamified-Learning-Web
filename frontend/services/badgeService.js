const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const badgeService = {
  getUserBadges: async (
    userId
  ) => {
    const response = await fetch(
      `${API_URL}/user-badges/user/${userId}`
    );

    return response.json();
  },

  getBadges: async () => {
    const response = await fetch(
      `${API_URL}/badges`
    );

    return response.json();
  },
};

export default badgeService;