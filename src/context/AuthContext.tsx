import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import axios from 'axios';

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
        console.log("1. Entrando en login");
        try {
            console.log("2. Lanzando petición directa...");
            
            const response = await axios.post('http://localhost:3000/api/auth/login', credentials, {
                withCredentials: true
            });

            console.log("3. Respuesta recibida:", response.data);

            const { accessToken, user, success } = response.data;

            if (success && accessToken) {
                setToken(accessToken);
                setUser(user);

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('user', JSON.stringify(user));

                console.log("✅ Todo guardado. ¡Navegando!");
                return true; 
            }

            console.log("⚠️ El Back dio 200 pero el formato no es el esperado");
            return false;
            
        } catch (error) {
            console.error("4. Error capturado:", error);
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