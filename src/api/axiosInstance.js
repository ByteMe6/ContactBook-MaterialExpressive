import axios from "axios";
import { baseUrl } from "./baseUrl.js";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - Add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      // Add token to Authorization header if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`🔑 Request to ${config.url} with token`);
      } else {
        console.log(`⚠️ Request to ${config.url} without token`);
      }

      return config;
    },
    (error) => {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
      // Success response
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}: ${response.status}`);
      return response;
    },
    (error) => {
      // Error response
      const status = error.response?.status;
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();

      console.error(`❌ ${method} ${url}:`, {
        status,
        message: error.message,
        data: error.response?.data
      });

      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - Token expired or invalid
        console.log("🚪 401 Unauthorized - Token invalid or expired");

        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Only redirect if not already on login/register page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          console.log("🔄 Redirecting to login page");
          window.location.href = "/login";
        }
      } else if (status === 403) {
        // Forbidden - User doesn't have permission
        console.error("🚫 403 Forbidden - Access denied");
      } else if (status === 404) {
        // Not found
        console.error("🔍 404 Not Found");
      } else if (status === 429) {
        // Too many requests
        console.error("⏱️ 429 Too Many Requests - Rate limited");
      } else if (status >= 500) {
        // Server error
        console.error("🔥 Server Error:", status);
      } else if (error.code === 'ECONNABORTED') {
        // Timeout
        console.error("⏱️ Request timeout");
      } else if (!error.response) {
        // Network error
        console.error("🌐 Network error - No response received");
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;