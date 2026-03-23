import api from './api';

const API_URL = 'http://localhost:3000/api/auth';

export const authService = {
    checkEmail: async (email: string) => {
        const response = await api.post(`${API_URL}/check-email`, { email });
        return response.data;
    },

    getMetadata: async () => {
        const response = await api.get(`${API_URL}/metadata`);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post(`${API_URL}/login`, credentials);
        
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken); 
            localStorage.setItem('refreshToken', response.data.refreshToken); 
        }
        return response.data;
    },

    verifyEmail: async (code: string, email: string) => {
        const response = await api.post(`${API_URL}/verify-email`, { code, email });
        
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
};