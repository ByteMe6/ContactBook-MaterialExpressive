import axiosInstance from "./axiosInstance.js";

export function login(login, password) {
  const body = { login, password };
  return axiosInstance.post("/auth/login", body);
}
