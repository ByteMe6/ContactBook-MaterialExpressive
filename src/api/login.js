import axios from "axios";

const baseURL = "https://api.hellper.dev";

export function login(login, password) {
  return axios.post(`${baseURL}/auth/login`, {
    login,
    password
  });
}
