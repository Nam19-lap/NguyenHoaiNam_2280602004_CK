import api from "./api";

export const activityService = {
  list: async (params) => (await api.get("/activities", { params })).data.data
};
