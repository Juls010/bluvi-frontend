import api from './api';

const API_URL = '/auth'; 

export interface RegisterPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    id_gender: number | null;
    id_preference: number | null;
    city: string;
    city_lat?: number | null;
    city_lng?: number | null;
    description: string;
    interests: number[];
    neurodivergences: number[];
    communication_style: number[];
    photos: string[];
    privacy_accepted_at: string;
    privacy_version: string;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    exists?: boolean;
    emailVerificationRequired?: boolean;
    accessToken?: string;
    token?: string;
    user?: unknown;
}

export const authService = {
    checkEmail: async (email: string): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>(`${API_URL}/check-email`, { email });
        return response.data;
    },

    getMetadata: async () => {
        const response = await api.get(`${API_URL}/metadata`);
        return response.data;
    },

    register: async (userData: RegisterPayload): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    verifyEmail: async (code: string, email: string): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>(`${API_URL}/verify-email`, { code, email });
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
