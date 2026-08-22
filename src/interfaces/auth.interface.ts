import { IUser } from "./user.interface";

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  initialized: boolean;

  setUser: (user: IUser) => void;
  setAccessToken: (accessToken: string) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
}
