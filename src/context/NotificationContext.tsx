import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { getConversations } from '../services/chat.service';
import { getIncomingMatchRequests } from '../services/match.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';
import bluviFaviconUrl from '../assets/icon.svg';

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
    const notificationFaviconRef = useRef<string | null>(null);

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

    const hasNotifications = unreadMessages > 0 || pendingMatchRequests > 0;

    useEffect(() => {
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!favicon) return;

        if (!hasNotifications) {
            notificationFaviconRef.current = null;
            favicon.href = bluviFaviconUrl;
            favicon.setAttribute('type', 'image/svg+xml');
            return;
        }

        if (notificationFaviconRef.current) {
            favicon.href = notificationFaviconRef.current;
            favicon.setAttribute('type', 'image/png');
            return;
        }

        let cancelled = false;
        const size = 64;
        const image = new Image();

        image.onload = () => {
            if (cancelled) return;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const context = canvas.getContext('2d');
            if (!context) return;

            context.clearRect(0, 0, size, size);
            context.drawImage(image, 0, 0, size, size);

            context.fillStyle = '#22c55e';
            context.beginPath();
            context.arc(50, 14, 11, 0, Math.PI * 2);
            context.fill();
            context.strokeStyle = '#ffffff';
            context.lineWidth = 4;
            context.stroke();

            const notificationFavicon = canvas.toDataURL('image/png');
            notificationFaviconRef.current = notificationFavicon;
            favicon.href = notificationFavicon;
            favicon.setAttribute('type', 'image/png');
        };

        image.onerror = () => {
            favicon.href = bluviFaviconUrl;
            favicon.setAttribute('type', 'image/svg+xml');
        };

        image.src = bluviFaviconUrl;

        return () => {
            cancelled = true;
        };
    }, [hasNotifications]);

    const value = useMemo(() => ({
        unreadMessages,
        pendingMatchRequests,
        pendingRequestNames,
        hasNotifications,
        refreshNotifications,
    }), [unreadMessages, pendingMatchRequests, pendingRequestNames, hasNotifications, refreshNotifications]);

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
