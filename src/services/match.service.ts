import api from './api';

export interface IncomingMatchRequest {
    id_match: number;
    message: string;
    created_at: string;
    id_user: number;
    first_name: string;
    last_name: string;
    is_face_verified?: boolean;
    main_photo: string | null;
}

export interface MatchItem {
    id_match: number;
    created_at: string;
    updated_at: string | null;
    message: string;
    id_user: number;
    first_name: string;
    last_name: string;
    is_face_verified?: boolean;
    main_photo: string | null;
}

export const sendMatchRequest = async (targetUserId: number, icebreakerMessage: string) => {
    const response = await api.post('/matches/requests', { targetUserId, icebreakerMessage });
    return response.data;
};

export const getIncomingMatchRequests = async (): Promise<IncomingMatchRequest[]> => {
    const response = await api.get<{ requests: IncomingMatchRequest[] }>('/matches/requests/incoming');
    return response.data.requests || [];
};

export const respondToMatchRequest = async (idRequest: number, action: 'accept' | 'reject') => {
    const response = await api.patch(`/matches/requests/${idRequest}/respond`, { action });
    return response.data;
};

export const getMyMatches = async (): Promise<MatchItem[]> => {
    const response = await api.get<{ matches: MatchItem[] }>('/matches');
    return response.data.matches || [];
};
