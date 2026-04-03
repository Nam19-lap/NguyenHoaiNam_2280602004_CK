import api from "./api";

export const projectService = {
  list: async (search = "") => (await api.get("/projects", { params: { search } })).data.data,
  getById: async (id) => (await api.get(`/projects/${id}`)).data.data,
  create: async (payload) => (await api.post("/projects", payload)).data.data,
  update: async (id, payload) => (await api.patch(`/projects/${id}`, payload)).data.data,
  remove: async (id) => (await api.delete(`/projects/${id}`)).data
};
