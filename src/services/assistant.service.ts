import api from './api';

export type AssistantHistoryMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type AssistantMessagePayload = {
    message: string;
    screen?: string;
    history?: AssistantHistoryMessage[];
};

type AssistantMessageResponse = {
    success: boolean;
    reply: string;
    model?: string;
};

export const assistantService = {
    sendMessage: async (payload: AssistantMessagePayload) => {
        const response = await api.post<AssistantMessageResponse>('/assistant/message', payload);
        return response.data;
    },
};
