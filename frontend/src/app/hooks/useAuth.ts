import { useState } from 'react';

// Types
interface User {
    id: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
    };
}

interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
    };
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // API base URL - adjust this to match your backend
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data: LoginResponse = await response.json();

            if (data.success && data.data) {
                localStorage.setItem('auth_token', data.data.token);
                setUser(data.data.user);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, password: string, role?: string): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            const data: RegisterResponse = await response.json();

            if (data.success && data.data) {
                localStorage.setItem('auth_token', data.data.token);
                setUser(data.data.user);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const getToken = (): string | null => {
        return localStorage.getItem('auth_token');
    };

    return {
        user,
        login,
        register,
        logout,
        getToken,
        isLoading,
        isAuthenticated: !!user,
    };
}