import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

const authStore = useAuthStore.getState();

export const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );

  const accessToken = response.data.accessToken;

  if (!accessToken) {
    throw new Error("Refresh response did not contain accessToken");
  }

  authStore.setAccessToken(accessToken);

  return accessToken;
};

export const restoreSession = async () => {
  try {
    const accessToken = await refreshAccessToken();

    const response = await axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    authStore.setUser(response.data.user);

    return true;
  } catch (error) {
    authStore.clearAuth();
    return false;
  } finally {
    authStore.setInitialized(true);
  }
};
