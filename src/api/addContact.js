import {baseUrl} from "./baseUrl.js";
import axios from "axios";

export async function createContact(name, phoneNumber, jwt) {
  try {
    const res = await axios.post(
        `${baseUrl}/contacts`,
        { name, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
    );
    return res.data;
  } catch (e) {
    console.error("POST ERROR:", e.response?.data || e.message);
    throw e;
  }
}