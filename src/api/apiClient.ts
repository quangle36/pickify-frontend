import axios, { type AxiosRequestConfig } from "axios";
import { normalizeApiError } from "./errors";

let csrfToken = "";

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  config.headers.set("X-Request-ID", crypto.randomUUID());
  if (csrfToken) config.headers.set("X-CSRF-Token", csrfToken);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<T>(config);
  return response.data;
}
