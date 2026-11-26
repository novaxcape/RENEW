import axios from "axios";

// One shared axios instance. `withCredentials` makes the browser send and
// accept the httpOnly `token` cookie set by the backend on login.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// If the cookie expired / is invalid, tell the app so it can log the user out.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = /\/(login|verify|resendOtp|forgot-password|reset-password)$/.test(url);
    if (error.response?.status === 401 && !isAuthCall) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error.response) return "Cannot reach the server. It may be waking up — please try again in a moment.";
  return error.response.data?.message || fallback;
};
