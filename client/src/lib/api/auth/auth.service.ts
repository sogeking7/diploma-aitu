import { authApi, usersApi } from "../api.service";
import { RoleEnum, UserOut } from "../../open-api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  role: RoleEnum;
}

const AuthService = {
  async login(credentials: LoginCredentials): Promise<void> {
    const response = await authApi.loginApiV1AuthLoginPost(
      credentials.email,
      credentials.password,
    );
    this.setTokens(response.data.access_token);
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    await authApi.registerApiV1AuthRegisterPost(credentials);
  },

  setTokens(session_token: string): void {
    localStorage.setItem("session_token", session_token);
  },

  clearTokens(): void {
    localStorage.removeItem("session_token");
  },

  async getCurrentUser(): Promise<UserOut> {
    const response = await usersApi.readCurrentUserApiV1UsersMeGet();
    return response.data;
  },
};

export default AuthService;
