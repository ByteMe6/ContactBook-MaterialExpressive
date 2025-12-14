import axios from "axios";
import { baseUrl } from "./baseUrl.js";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      // DEBUG: Log token and request
      console.log("🔑 Making request to:", config.url);
      console.log("🔑 Token exists:", !!token);
      console.log("🔑 Token value:", token ? token.substring(0, 20) + "..." : "none");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Authorization header set:", config.headers.Authorization.substring(0, 30) + "...");
      } else {
        console.log("❌ No token found in localStorage!");
      }

      return config;
    },
    (error) => {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
);

// Response interceptor - Handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => {
      console.log("✅ Response received:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error("❌ Response error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      });

      if (error.response && error.response.status === 401) {
        console.log("🚪 401 Unauthorized - clearing auth and redirecting to login");
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default axiosInstance;