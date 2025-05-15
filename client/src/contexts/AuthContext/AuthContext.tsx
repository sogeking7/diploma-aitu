import React, { createContext, useContext, useEffect, useState } from "react";
import AuthService, {
  LoginCredentials,
  RegisterCredentials,
} from "../../lib/api/auth/auth.service";
import { UserOut } from "../../lib/open-api";

interface AuthContextType {
  user: UserOut | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to get user data", error);
      AuthService.clearTokens();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    await AuthService.login(credentials);
    const userData = await AuthService.getCurrentUser();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterCredentials) => {
    await AuthService.register(credentials);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      AuthService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
