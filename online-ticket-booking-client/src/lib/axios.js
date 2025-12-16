// frontend/src/api.js
import axios from "axios";

const baseURL = "http://localhost:5000"; // backend URL

export const api = axios.create({
  baseURL,
  withCredentials: true, // allow cookies to be sent/received
});

// Optional: centralized error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API Error:", err.response?.data);
    return Promise.reject(err);
  }
);

export default api;
