
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

interface AuthResponse {
    success: boolean;
    message: string;
    token?: string; 
    user?: {
        id: number;
        email: string;
        first_name: string;
    };
}

export const authService = {
    checkEmail: async (email: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/check-email`, { email });
        return response.data;
    },

    register: async (userData: any): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
        
        if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        }
        
        return response.data;
    },

    verifyEmail: async (code: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/verify-email`, { code });
    return response.data;
    },

    getMetadata: async () => {
        const response = await axios.get(`${API_URL}/metadata`);
        return response.data;
    },

    // Logout: Limpiar el rastro
    logout: () => {
        localStorage.removeItem('token');
    }

};