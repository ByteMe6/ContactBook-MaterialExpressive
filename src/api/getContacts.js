import axiosInstance from "./axiosInstance.js";

export async function getContacts() {
  const res = await axiosInstance.get("/contacts");
  return res.data;
}