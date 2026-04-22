const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

const authService = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};

export default authService;