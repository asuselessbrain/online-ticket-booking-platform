// frontend/src/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookies to be sent/received
});

// Optional: centralized error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
