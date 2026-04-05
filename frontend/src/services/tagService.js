import api from "./api";

export const tagService = {
  list: async () => (await api.get("/tags")).data.data,
  create: async (payload) => (await api.post("/tags", payload)).data.data,
  remove: async (id) => (await api.delete(`/tags/${id}`)).data
};
