import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getConversations } from '../services/chat.service';
import { getIncomingMatchRequests } from '../services/match.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';

interface NotificationContextType {
    unreadMessages: number;
    pendingMatchRequests: number;
    pendingRequestNames: string[];
    hasNotifications: boolean;
    refreshNotifications: () => Promise<void>;
}

const defaultNotificationContext: NotificationContextType = {
    unreadMessages: 0,
    pendingMatchRequests: 0,
    pendingRequestNames: [],
    hasNotifications: false,
    refreshNotifications: async () => {},
};

const NotificationContext = createContext<NotificationContextType>(defaultNotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingMatchRequests, setPendingMatchRequests] = useState(0);
    const [pendingRequestNames, setPendingRequestNames] = useState<string[]>([]);

    const refreshNotifications = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setUnreadMessages(0);
            setPendingMatchRequests(0);
            setPendingRequestNames([]);
            return;
        }

        try {
            const [conversations, incomingRequests] = await Promise.all([
                getConversations(),
                getIncomingMatchRequests(),
            ]);

            const unreadTotal = conversations.reduce((acc, conversation) => acc + (conversation.unread_count || 0), 0);
            setUnreadMessages(unreadTotal);
            setPendingMatchRequests(incomingRequests.length);
            setPendingRequestNames(incomingRequests.slice(0, 3).map((request) => `${request.first_name} ${request.last_name}`));
        } catch (error) {
            console.error('Error cargando notificaciones globales:', error);
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            disconnectRealtime();
            return;
        }

        const socket = connectRealtime();
        const handleRefresh = () => {
            refreshNotifications();
        };

        socket?.on('match:request:new', handleRefresh);
        socket?.on('match:accepted', handleRefresh);
        socket?.on('chat:message:new', handleRefresh);
        socket?.on('chat:messages:read', handleRefresh);

        return () => {
            socket?.off('match:request:new', handleRefresh);
            socket?.off('match:accepted', handleRefresh);
            socket?.off('chat:message:new', handleRefresh);
            socket?.off('chat:messages:read', handleRefresh);
        };
    }, [isAuthenticated, token, refreshNotifications]);

    const value = useMemo(() => ({
        unreadMessages,
        pendingMatchRequests,
        pendingRequestNames,
        hasNotifications: unreadMessages > 0 || pendingMatchRequests > 0,
        refreshNotifications,
    }), [unreadMessages, pendingMatchRequests, pendingRequestNames, refreshNotifications]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    return context;
};
