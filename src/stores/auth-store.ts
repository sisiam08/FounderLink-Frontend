import { IAuthState } from "@/interfaces";
import { create } from "zustand";

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  accessToken: null,
  initialized: false,

  setUser: (user) =>
    set({
      user,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setInitialized: (initialized) =>
    set({
      initialized,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
