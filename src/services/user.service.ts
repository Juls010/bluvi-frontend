import axios from 'axios';
import type { User } from '../types/User.types';


const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL
});

// Interceptor de Petición 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

// Interceptor de Respuesta 
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken'); 
            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/users/refresh`, { refresh: refreshToken });
                    const { access } = res.data;
                    localStorage.setItem('accessToken', access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// --- FUNCIONES DEL SERVICIO ---

export const getMyProfile = async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/users/profile'); 
    return response.data.user;
};

export const updateMyProfile = async (updated: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>('/users/profile', updated);
    return response.data.user;
};

export const getExploreUsers = async (params: any) => {
    const response = await api.get('/users/explore', { params }); 
    return response.data; 
};

export const deleteMyAccount = async (password: string): Promise<void> => {
    await api.delete('/users/profile', { data: { password } });
};

export interface Privacy {
    is_visible: boolean;
    messages_only_matches: boolean;
}

export const getPrivacy = async (): Promise<Privacy> => {
    const response = await api.get<{ privacy: Privacy }>('/users/privacy');
    return response.data.privacy;
};

export const updatePrivacy = async (privacy: Partial<Privacy>): Promise<Privacy> => {
    const response = await api.patch<{ privacy: Privacy }>('/users/privacy', privacy);
    return response.data.privacy;
};