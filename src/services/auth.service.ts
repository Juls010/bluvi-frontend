import api from './api';

const API_URL = '/auth'; 

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
        return response.data;
    },

    verifyEmail: async (code: string, email: string) => {
        const response = await api.post(`${API_URL}/verify-email`, { code, email });
        return response.data;
    },

    logout: async () => {
        try {
            await api.post(`${API_URL}/logout`);
        } catch (error) {
            console.error("Error avisando al servidor del logout:", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
    }
};