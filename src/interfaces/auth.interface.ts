import { IUser } from "./user.interface";

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;

//   setAuth: (user: IUser, accessToken: string) => void;
  setUser: (user: IUser) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}