import { IApiResponse, IRefreshResponse, IUser } from "@/interfaces";
import { useAuthStore } from "@/stores/auth-store";
import api from "./api-client";

const authStore = useAuthStore.getState();

export const refreshAccessToken = async (): Promise<IRefreshResponse> => {
  const response = await api.post<IApiResponse<IRefreshResponse>>(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );

  const { user, accessToken } = response.data.data;

  if (!user || !accessToken) {
    throw new Error("Refresh response did not contain required data");
  }

  authStore.setAuth({ user, accessToken });
  return { user, accessToken };
};

export const restoreSession = async () => {
  try {
    await refreshAccessToken();

    return true;
  } catch (error) {
    authStore.clearAuth();
    return false;
  } finally {
    authStore.setInitialized(true);
  }
};
