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
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken'); 
        const savedUser = localStorage.getItem('user');        
        
        if (savedToken) {
            setToken(savedToken);
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    localStorage.removeItem('user');
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
        try {
            const response = await authService.login(credentials);
            console.log("👀 Datos que llegan al Contexto:", response);

            if (response.success && response.access) { 
                const authToken = response.access;
                const authUser = response.user;

                setToken(authToken);
                setUser(authUser);

                // Guardamos con los nombres que prefieras, pero seamos consistentes
                localStorage.setItem('accessToken', authToken); 
                localStorage.setItem('user', JSON.stringify(authUser));
                
                if (response.refresh) {
                    localStorage.setItem('refreshToken', response.refresh);
                }
                
                return true;
            }
            
            console.log("⚠️ El IF falló. success:", response.success, "token:", !!response.access);
            return false;
        } catch (error) {
            console.error("Error en login:", error);
            return false;
        }
    };

    const logout = () => {
        authService.logout(); 
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
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



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};