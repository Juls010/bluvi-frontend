import api from './api';
import type { User } from '../types/User.types';

export type Atmosphere = 'normal' | 'tranquilo' | 'bajo';

export type UserProfileUpdatePayload = Omit<Partial<User>, 'interests' | 'features' | 'communication_style' | 'photos'> & {
    interests?: number[];
    features?: number[];
    neurodivergences?: number[];
    communication_style?: number[];
    photos?: string[];
    city_lat?: number | null;
    city_lng?: number | null;
};

export interface ExploreUsersResponse {
    success: boolean;
    count: number;
    users: User[];
    hasMore: boolean;
    nextCursor: number | null;
    limit: number;
}



export const getMyProfile = async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/users/profile'); 
    return response.data.user;
};

export const updateMyProfile = async (updated: UserProfileUpdatePayload): Promise<User> => {
    const response = await api.put<{ user: User }>('/users/profile', updated);
    return response.data.user;
};

export const markFaceVerification = async (): Promise<User> => {
    const response = await api.patch<{ user: User }>('/users/profile/face-verification');
    return response.data.user;
};

export const getExploreUsers = async (params: Record<string, unknown>): Promise<ExploreUsersResponse> => {
    const response = await api.get<ExploreUsersResponse>('/users/explore', { params });
    return response.data;
};

export const deleteMyAccount = async (password: string): Promise<void> => {
    await api.delete('/users/profile', { data: { password } });
};

export interface Privacy {
    is_visible: boolean;
    messages_only_matches: boolean;
    show_online_status: boolean;
}

export interface AccessibilityPreferences {
    contrast: 'normal' | 'high';
    reduce_motion: boolean;
    font_size: 'normal' | 'large' | 'xlarge';
}

export const markDiscoverySeen = async (seenUserId: number, action: 'passed' | 'liked' | 'dismissed' = 'passed'): Promise<void> => {
    await api.post('/users/discovery/seen', { seenUserId, action });
};

export const getPrivacy = async (): Promise<Privacy> => {
    const response = await api.get<{ privacy: Privacy }>('/users/privacy');
    return response.data.privacy;
};

export const updatePrivacy = async (privacy: Partial<Privacy>): Promise<Privacy> => {
    const response = await api.patch<{ privacy: Privacy }>('/users/privacy', privacy);
    return response.data.privacy;
};

export const getAccessibilityPreferences = async (): Promise<AccessibilityPreferences> => {
    const response = await api.get<{ accessibility: AccessibilityPreferences }>('/users/accessibility');
    return response.data.accessibility;
};

export const updateAccessibilityPreferences = async (
    accessibility: Partial<AccessibilityPreferences>
): Promise<AccessibilityPreferences> => {
    const response = await api.patch<{ accessibility: AccessibilityPreferences }>('/users/accessibility', accessibility);
    return response.data.accessibility;
};

export const updateAtmosphere = async (atmosphere: Atmosphere): Promise<Atmosphere> => {
    const response = await api.put<{ atmosphere: Atmosphere }>('/users/atmosphere', { atmosphere });
    return response.data.atmosphere;
};

export const reportUser = async (userId: number, reason: string): Promise<void> => {
    await api.post(`/chats/${userId}/report`, { reason });
};

export const blockUser = async (userId: number): Promise<void> => {
    await api.post(`/chats/${userId}/block`);
};
