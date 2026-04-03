import api from "./api";

const toFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    if (key === "files" && value?.length) {
      Array.from(value).forEach((file) => formData.append("files", file));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const taskService = {
  list: async (params) => (await api.get("/tasks", { params })).data.data,
  exportCsv: async (params) =>
    (
      await api.get("/tasks/export/csv", {
        params,
        responseType: "blob"
      })
    ).data,
  getById: async (id) => (await api.get(`/tasks/${id}`)).data.data,
  create: async (payload) => (await api.post("/tasks", toFormData(payload))).data.data,
  update: async (id, payload) => (await api.patch(`/tasks/${id}`, toFormData(payload))).data.data,
  remove: async (id) => (await api.delete(`/tasks/${id}`)).data
};
