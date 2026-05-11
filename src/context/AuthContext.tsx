import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import api from '../services/api';

interface AuthUser {
    id: number;
    email: string;
    first_name?: string;
    firstName?: string;
    id_gender?: number | null;
    is_face_verified?: boolean;
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.clear();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', credentials);
            const payload = response.data ?? {};

            const accessToken =
                payload.accessToken ?? payload.token ?? payload.data?.accessToken ?? payload.data?.token;
            const userData = payload.user ?? payload.data?.user ?? null;
            const success = payload.success ?? Boolean(accessToken);

            if (success && accessToken) {
                setToken(accessToken);
                setUser(userData);

                localStorage.setItem('accessToken', accessToken);
                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                }

                return true; 
            }

            return false;
            
        } catch (error) {
            console.error('Error en login', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await authService.logout(); 
        } catch (err) {
            console.error("Error al cerrar sesión en el servidor", err);
        } finally {
            localStorage.clear();
            setToken(null);
            setUser(null);
        }
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



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};
