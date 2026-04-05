const apiBaseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const resolveMediaUrl = (value) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  return `${apiBaseUrl}${value}`;
};
