import axios from 'axios';
import type { User } from '../types/User.types';

const API_URL = 'http://localhost:3000/api/users';

const authHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No token found");
    return { Authorization: `Bearer ${token}` };
};

export const getMyProfile = async (): Promise<User> => {
    const response = await axios.get<{ user: User }>(`${API_URL}/profile`, {
        headers: authHeader(),
    });
    return response.data.user;
};

export const updateMyProfile = async (updated: User): Promise<User> => {
    const response = await axios.put<{ user: User }>(`${API_URL}/profile`, updated, {
        headers: authHeader(),
    });
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