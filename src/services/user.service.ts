import api from './api';
import type { User } from '../types/User.types';

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