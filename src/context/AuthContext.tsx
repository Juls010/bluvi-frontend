import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface AuthUser {
    id: number;
    email: string;
    first_name: string;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<boolean>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // true hasta verificar el token guardado

    // Al montar, comprobamos si ya hay token en localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            // Si guardaste datos básicos del user al hacer login, los recuperamos
            const savedUser = localStorage.getItem('auth_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    localStorage.removeItem('auth_user');
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
        try {
            const response = await authService.login(credentials);

            if (response.success && response.token && response.user) {
                setToken(response.token);
                setUser(response.user);
                // authService.login ya guarda el token, pero guardamos también el user
                localStorage.setItem('auth_user', JSON.stringify(response.user));
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};