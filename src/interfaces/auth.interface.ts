import { IUser } from "./user.interface";

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  initialized: boolean;

  setAuth: (auth: { user: IUser; accessToken: string }) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ISignupResponse {
  message: string;
  expiresAt: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
}

export interface IRefreshResponse {
  user: IUser;
  accessToken: string;
}
