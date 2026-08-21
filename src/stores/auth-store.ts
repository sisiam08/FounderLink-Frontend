import { IAuthState } from "@/interfaces";
import { create } from "zustand";

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  accessToken: null,

    setUser: (user) =>
      set({
        user,
      }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));