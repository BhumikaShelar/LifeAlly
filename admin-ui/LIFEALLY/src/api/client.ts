import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const API_BASE = "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach User-Id header automatically from sessionStorage for every request
client.interceptors.request.use((config: AxiosRequestConfig | any) => {
  if (!config) return config;
  try {
    const adminUserId = sessionStorage.getItem("adminUserId");
    if (adminUserId) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["User-Id"] = adminUserId;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export default client;