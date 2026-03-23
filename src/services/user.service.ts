import axios from 'axios';
import type { User } from '../types/User.types';

const API_URL = 'http://localhost:3000/api';
const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken'); 

            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/auth/refresh`, { refresh: refreshToken });
                    
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

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No token found");
    return { Authorization: `Bearer ${token}` };
};

export const getMyProfile = async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/users/profile'); 
    return response.data.user;
};

export const updateMyProfile = async (updated: User): Promise<User> => {
    const response = await api.put<{ user: User }>('/users/profile', updated);
    return response.data.user;
};

export const deleteMyAccount = async (password: string): Promise<void> => {
    await axios.delete(`${API_URL}/profile`, {
        headers: authHeader(),
        data: { password },
    });
};



export interface Privacy {
    is_visible: boolean;
    messages_only_matches: boolean;
}

export const getPrivacy = async (): Promise<Privacy> => {
    const response = await axios.get<{ privacy: Privacy }>(`${API_URL}/privacy`, {
        headers: authHeader(),
    });
    return response.data.privacy;
};

export const updatePrivacy = async (privacy: Partial<Privacy>): Promise<Privacy> => {
    const response = await axios.patch<{ privacy: Privacy }>(`${API_URL}/privacy`, privacy, {
        headers: authHeader(),
    });
    return response.data.privacy;
};