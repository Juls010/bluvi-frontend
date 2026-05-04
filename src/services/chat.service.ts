import api from './api';

export interface ConversationItem {
    chat_id: number;
    id_user: number;
    first_name: string;
    last_name: string;
    main_photo: string | null;
    last_message_id: number | null;
    last_message: string | null;
    last_message_type?: 'text' | 'audio';
    last_message_at: string | null;
    last_message_sender_id: number | null;
    last_message_read: boolean;
    last_message_delivered: boolean;
    unread_count: number;
}

export interface ChatCounterpart {
    id_user: number;
    first_name: string;
    last_name: string;
    main_photo: string | null;
}

export interface ChatMessage {
    id_message: number;
    chat_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    message_type?: 'text' | 'audio';
    audio_url?: string;
    duration_seconds?: number;
    transcript?: string | null;
    created_at: string;
    read_at: string | null;
    is_read?: boolean;
    is_delivered?: boolean;
}

interface ConversationsResponse {
    success: boolean;
    conversations: ConversationItem[];
}

interface ConversationMessagesResponse {
    success: boolean;
    counterpart: ChatCounterpart | null;
    chatId: number;
    otherUserReadCursor: number;
    hasMore: boolean;
    messages: ChatMessage[];
}

interface SendMessageResponse {
    success: boolean;
    message: ChatMessage;
}

interface TranscriptionResponse {
    success: boolean;
    text: string;
    updatedMessage?: ChatMessage;
    message?: string;
}

export const getConversations = async (): Promise<ConversationItem[]> => {
    const response = await api.get<ConversationsResponse>('/chats');
    return response.data.conversations || [];
};

export const getConversationMessages = async (
    userId: number,
    limit = 50,
    beforeId?: number
): Promise<ConversationMessagesResponse> => {
    const response = await api.get<ConversationMessagesResponse>(`/chats/${userId}/messages`, {
        params: { limit, beforeId },
    });
    return response.data;
};

export const sendConversationMessage = async (userId: number, message: string): Promise<ChatMessage> => {
    const response = await api.post<SendMessageResponse>(`/chats/${userId}/messages`, { message });
    return response.data.message;
};

export const markConversationRead = async (userId: number): Promise<void> => {
    await api.patch(`/chats/${userId}/read`);
};
 
export const markConversationDelivered = async (userId: number): Promise<void> => {
    await api.patch(`/chats/${userId}/delivered`);
};

export interface UserOnlineStatus {
    isOnline: boolean;
    canShowOnlineStatus: boolean;
}

export const checkUserOnline = async (userId: number): Promise<UserOnlineStatus> => {
    try {
        const response = await api.get<{ success: boolean; isOnline: boolean; canShowOnlineStatus?: boolean }>(`/chats/${userId}/online`);
        return {
            isOnline: Boolean(response.data.isOnline),
            canShowOnlineStatus: response.data.canShowOnlineStatus !== false,
        };
    } catch (error) {
        console.error('Error verificando estado online:', error);
        return { isOnline: false, canShowOnlineStatus: true };
    }
};

export const deleteConversation = async (userId: number, block = false): Promise<void> => {
    await api.delete(`/chats/${userId}${block ? '?block=true' : ''}`);
};

export const blockUser = async (userId: number): Promise<void> => {
    await api.post(`/chats/${userId}/block`);
};

export const unblockUser = async (userId: number): Promise<void> => {
    await api.delete(`/chats/${userId}/block`);
};

export const getBlockedUsers = async (): Promise<any[]> => {
    const response = await api.get('/chats/blocked');
    return response.data.blockedUsers;
};

export const reportUser = async (userId: number, reason?: string): Promise<void> => {
    await api.post(`/chats/${userId}/report`, { reason });
};

export const getMyReports = async (): Promise<any[]> => {
    const response = await api.get('/chats/reports');
    return response.data.reports;
};

export const sendAudioMessage = async (
    userId: number,
    audioUrl: string,
    durationSeconds: number,
): Promise<ChatMessage> => {
    const response = await api.post<SendMessageResponse>(`/chats/${userId}/messages/audio`, {
        audioUrl,
        durationSeconds,
    });
    return response.data.message;
};

export const transcribeAudioMessage = async (messageId: number, audioUrl: string, language = 'es'): Promise<TranscriptionResponse> => {
    const response = await api.post<TranscriptionResponse>('/transcriptions', {
        messageId,
        audioUrl,
        language,
    });

    return response.data;
};
