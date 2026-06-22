import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getToken } from "../storage/authStorage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});