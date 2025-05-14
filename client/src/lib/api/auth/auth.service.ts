import { authApi, usersApi } from "../api.service";
import { UserOut } from "../../open-api";
import Cookies from "js-cookie";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
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
    await authApi.registerApiV1AuthRegisterPost({
      first_name: credentials.name,
      last_name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      role: "admin",
    });
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
