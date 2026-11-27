import axios from "axios";

// VITE_API_URL=https://novaxcape.onrender.com  (set in .env, no trailing /api/v1)
const ROOT = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${ROOT}/api/v1`,
  timeout: 60000, // Render free instances can take a while to wake up
});

const getToken = () => {
  const role = localStorage.getItem("role");
  if (role === "vendor") {
    return localStorage.getItem("vendorToken") || localStorage.getItem("token");
  }
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("vendorToken")
  );
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const googleAuthUrl = `${ROOT}/api/v1/client/auth/google`;

export const errorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (err?.request) return "Cannot reach the server. Check your connection and try again.";
  return fallback;
};

const pickToken = (data) => data?.token || data?.accessToken || data?.data?.token || null;
const pickUser = (data) =>
  data?.user || data?.client || data?.vendor || data?.data?.user || data?.data?.client || data?.data?.vendor || data?.data || null;

export const saveSession = (role, data, fallbackEmail = "") => {
  const token = pickToken(data);
  const user = pickUser(data) || {};
  const id = user.id || user._id || "";

  localStorage.setItem("role", role);
  if (role === "vendor") {
    if (token) localStorage.setItem("vendorToken", token);
    if (id) localStorage.setItem("vendorId", id);
    localStorage.setItem("vendorEmail", user.email || fallbackEmail);
    localStorage.setItem("Names", user.centerName || user.centreName || user.email || fallbackEmail);
  } else {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userToken", token);
    }
    if (id) localStorage.setItem("clientId", id);
    localStorage.setItem("clientEmail", user.email || fallbackEmail);
    localStorage.setItem(
      "Names",
      [user.firstName, user.lastName].filter(Boolean).join(" ") || user.userName || user.email || fallbackEmail
    );
  }
  return { token, user };
};

export const clearSession = () => {
  [
    "role", "token", "userToken", "vendorToken", "clientId", "clientEmail",
    "vendorId", "vendorEmail", "Names", "Name",
  ].forEach((k) => localStorage.removeItem(k));
};

export const isLoggedIn = () => !!getToken();

export default api;
