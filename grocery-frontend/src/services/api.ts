import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Central Axios instance.
//
// BASE_URL is the ONLY thing you need to change to point the app at a real
// backend (e.g. your Node/MERN API). Every screen calls the typed service
// methods in services/*.ts — never axios directly — so once this file talks
// to your real API, no screen code needs to change.
// ---------------------------------------------------------------------------

export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/v1";

export const AUTH_TOKEN_KEY = "@greenroot/auth_token";

export const api = axios.create({
  baseURL: BASE_URL,
  // Render free services can take a few seconds to wake from sleep.
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every outgoing request.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Normalize errors into a consistent shape the UI can rely on.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : "Something went wrong. Please check your connection.");
    return Promise.reject(new ApiError(message, status));
  }
);

export default api;
