import api from "./api";

export const notificationService = {
  list: async () => (await api.get("/notifications")).data.data,
  markRead: async (id) => (await api.patch(`/notifications/${id}/read`)).data.data,
  markUnread: async (id) => (await api.patch(`/notifications/${id}/unread`)).data.data,
  markAllRead: async () => (await api.patch("/notifications/read-all")).data
};
