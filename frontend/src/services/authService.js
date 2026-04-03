import api from "./api";

export const authService = {
  login: async (payload) => (await api.post("/auth/login", payload)).data.data,
  register: async (payload) => (await api.post("/auth/register", payload)).data.data,
  me: async () => (await api.get("/auth/me")).data.data,
  logout: async (refreshToken) => (await api.post("/auth/logout", { refreshToken })).data,
  updateProfile: async (payload) => (await api.patch("/users/me", payload)).data.data,
  changePassword: async (payload) => (await api.patch("/users/me/password", payload)).data
};
