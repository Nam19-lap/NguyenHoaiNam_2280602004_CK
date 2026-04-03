import axios from "axios";
import { authStorage } from "./authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = authStorage.getRefreshToken();
    const isAuthScreenRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken && !isAuthScreenRequest) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken
          })
          .then((response) => {
            authStorage.setSession(response.data.data);
            return response.data.data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const nextToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStorage.clear();
        throw refreshError;
      }
    }

    throw error;
  }
);

export default api;
