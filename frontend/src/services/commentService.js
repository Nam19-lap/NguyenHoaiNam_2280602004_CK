import api from "./api";

const toFormData = (payload = {}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "files" && value?.length) {
      Array.from(value).forEach((file) => formData.append("files", file));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const commentService = {
  listByTask: async (taskId) => (await api.get(`/comments/task/${taskId}`)).data.data,
  create: async (payload) => (await api.post("/comments", toFormData(payload))).data.data,
  update: async (id, payload) => (await api.patch(`/comments/${id}`, toFormData(payload))).data.data,
  toggleReaction: async (id, emoji) => (await api.patch(`/comments/${id}/reactions`, { emoji })).data.data,
  remove: async (id) => (await api.delete(`/comments/${id}`)).data
};
