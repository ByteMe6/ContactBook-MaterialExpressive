import axiosInstance from "./axiosInstance.js";

export async function createContact(name, phoneNumber) {
  const res = await axiosInstance.post("/contacts", {
    name,
    phoneNumber
  });
  return res.data;
}