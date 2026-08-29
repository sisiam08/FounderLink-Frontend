import { envConfig } from "@/env";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { IApiResponse } from "@/interfaces";

const API_URL = envConfig.NEXT_PUBLIC_API_URL;

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

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
  const response = await api.post<IApiResponse<void>>(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );
};

const getRefreshPromise = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 && originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        await getRefreshPromise();
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          const isLoginPage = window.location.pathname === "/login";
          if (!isLoginPage) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
