import { envConfig } from "@/env";
import { useAuthStore } from "@/stores/auth-store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth-refresh";
import { IRefreshResponse } from "@/interfaces";

const API_URL = envConfig.NEXT_PUBLIC_API_URL;
const AUTH_REFRESH_EXCLUDED_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/signup/verify-otp",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise: Promise<IRefreshResponse> | null = null;

const shouldSkipRefresh = (url?: string) => {
  if (!url) {
    return false;
  }

  return AUTH_REFRESH_EXCLUDED_PATHS.some((path) => url.includes(path));
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url;
    const hasAccessToken = Boolean(useAuthStore.getState().accessToken);

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      !hasAccessToken ||
      shouldSkipRefresh(requestUrl)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const { accessToken } = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";
        if (!isLoginPage) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
