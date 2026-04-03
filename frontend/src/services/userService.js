import api from "./api";

export const userService = {
  list: async () => (await api.get("/users")).data.data,
  update: async (id, payload) => (await api.patch(`/users/${id}`, payload)).data.data,
  remove: async (id) => (await api.delete(`/users/${id}`)).data
};
