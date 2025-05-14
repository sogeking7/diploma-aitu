// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService, {LoginCredentials, RegisterCredentials} from "../../lib/api/auth/auth.service";

interface AuthContextType {
    user: any;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated when component mounts
        const initAuth = async () => {
            if (AuthService.isAuthenticated()) {
                try {
                    const userData = await AuthService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to get user data', error);
                    AuthService.clearTokens();
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        try {
            const response = await AuthService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setLoading(true);
        try {
            const response = await AuthService.register(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};
