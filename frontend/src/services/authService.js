import api from "./api";

const toProfileFormData = (payload = {}) => {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.avatar !== undefined) {
    formData.append("avatar", payload.avatar);
  }

  if (payload.avatarFile) {
    formData.append("avatarFile", payload.avatarFile);
  }

  return formData;
};

export const authService = {
  login: async (payload) => (await api.post("/auth/login", payload)).data.data,
  register: async (payload) => (await api.post("/auth/register", payload)).data.data,
  me: async () => (await api.get("/auth/me")).data.data,
  logout: async (refreshToken) => (await api.post("/auth/logout", { refreshToken })).data,
  updateProfile: async (payload) => (await api.patch("/users/me", toProfileFormData(payload))).data.data,
  changePassword: async (payload) => (await api.patch("/users/me/password", payload)).data
};
