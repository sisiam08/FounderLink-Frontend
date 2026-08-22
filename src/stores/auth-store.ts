import { IAuthState } from "@/interfaces";
import { create } from "zustand";

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  accessToken: null,
  initialized: false,

  setAuth: ({ user, accessToken }) =>
    set({
      user,
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
