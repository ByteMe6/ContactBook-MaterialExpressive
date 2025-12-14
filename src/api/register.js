import axiosInstance from "./axiosInstance.js";

export function register(login, password) {
  const body = { login, password };
  return axiosInstance.post("/auth/register", body);
}
