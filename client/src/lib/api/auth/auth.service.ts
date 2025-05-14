// src/services/auth.service.ts

import apiClient from "../api.service";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
    refreshToken: string;
}

const AuthService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    getUser(): any {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    setTokens(token: string, refreshToken: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    },

    clearTokens(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    async getCurrentUser(): Promise<any> {
        const response = await apiClient.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    }
};

export default AuthService;
