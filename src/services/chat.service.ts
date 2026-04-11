import api from './api';

export interface ConversationItem {
    match_request_id: number;
    id_user: number;
    first_name: string;
    last_name: string;
    main_photo: string | null;
    last_message: string | null;
    last_message_at: string | null;
    last_message_sender_id: number | null;
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
    match_request_id: number;
    sender_id: number;
    receiver_id: number;
    body: string;
    created_at: string;
    read_at: string | null;
    is_read?: boolean;
}

interface ConversationsResponse {
    success: boolean;
    conversations: ConversationItem[];
}

interface ConversationMessagesResponse {
    success: boolean;
    counterpart: ChatCounterpart | null;
    matchRequestId: number;
    otherUserReadCursor: number;
    hasMore: boolean;
    messages: ChatMessage[];
}

interface SendMessageResponse {
    success: boolean;
    message: ChatMessage;
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
