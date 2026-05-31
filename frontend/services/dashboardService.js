const API = "http://localhost:3000";

const dashboardService = {
  async getStats() {
    const res = await fetch(`${API}/dashboard/stats`);
    return res.json();
  },
};

export default dashboardService;