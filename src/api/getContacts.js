import axios from "axios";
import { baseUrl } from "./baseUrl.js";

export async function getContacts(jwt) {
  const response = await axios.get(`${baseUrl}/contacts`, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });

  return response.data;
}