const API = "http://localhost:3000";

const dashboardService = {
  async getStats(teacherId) {
    const res = await fetch(
      `${API}/dashboard/stats/${teacherId}`
    );

    if (!res.ok) {
      throw new Error("Failed to load dashboard stats");
    }

    return res.json();
  },
};

export default dashboardService;