import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import {
    getIncomingMatchRequests,
    respondToMatchRequest,
    type IncomingMatchRequest,
} from '../services/match.service';
import { getConversations, type ConversationItem } from '../services/chat.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';
import { useNotifications } from '../context/NotificationContext';

const formatTime = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
};

const MatchesSection: React.FC<{ requests: IncomingMatchRequest[]; onRespond: (id: number, action: 'accept' | 'reject') => void }> = ({ requests, onRespond }) => (
    <section aria-labelledby="matches-heading">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2
                    id="matches-heading"
                    className="text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: 'var(--app-messages-accent)' }}
                >
                    Nuevas conexiones
                </h2>
            </div>
            <span
                aria-label={`${requests.length} solicitudes nuevas`}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-app-soft"
                style={{
                    color: 'var(--app-messages-accent)',
                    backgroundColor: 'var(--app-messages-accent-bg)',
                }}
            >
                {requests.length} nuevas
            </span>
        </div>

        <div role="list" aria-label="Solicitudes de conexión" className="flex flex-col gap-3 py-3">
            {requests.length === 0 && (
                <p className="text-sm text-app-secondary">No tienes solicitudes pendientes ahora mismo.</p>
            )}

            {requests.map((request) => (
                <div key={request.id_request} className="rounded-2xl border border-app-soft bg-app-surface p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={request.main_photo || 'https://via.placeholder.com/120'}
                            alt={request.first_name}
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-app-primary truncate">
                                {request.first_name} {request.last_name}
                            </p>
                            <p className="text-xs text-app-muted mt-0.5">{formatTime(request.created_at)}</p>
                        </div>
                    </div>

                    <p className="text-sm text-app-secondary mt-3">"{request.icebreaker_message}"</p>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => onRespond(request.id_request, 'reject')}
                            className="flex-1 rounded-xl border border-app-soft py-2 text-sm font-semibold text-app-secondary hover:bg-app-surface-soft"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={() => onRespond(request.id_request, 'accept')}
                            className="flex-1 rounded-xl bg-bluvi-purple py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const ChatsSection: React.FC<{ conversations: ConversationItem[] }> = ({ conversations }) => (
    <section aria-labelledby="chats-heading">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-app-muted" aria-hidden="true" />
                <h2
                    id="chats-heading"
                    className="text-[11px] font-bold text-app-secondary uppercase tracking-[0.2em]"
                >
                    Conversaciones
                </h2>
            </div>
            {conversations.length > 0 && (
                <span
                    aria-label={`Tienes ${conversations.length} conversaciones activas`}
                    className="text-[11px] font-semibold text-app-on-accent px-2.5 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: 'var(--app-accent)' }}
                >
                    {conversations.length} activas
                </span>
            )}
        </div>

        <ul aria-label="Lista de conversaciones" className="flex flex-col gap-2.5">
            {conversations.map((conversation) => (
                <li key={conversation.match_request_id}>
                    <Link
                        to={`/app/chat/${conversation.id_user}`}
                        aria-label={`
                            Chat con ${conversation.first_name} ${conversation.last_name}.
                            Último mensaje: ${conversation.last_message || 'Sin mensajes todavía'}
                        `}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-app-surface border border-app-soft backdrop-blur-md hover:bg-app-surface-strong transition-all duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40"
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={conversation.main_photo || 'https://via.placeholder.com/120'}
                                alt=""          
                                className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                                loading="lazy"
                            />

                            {conversation.unread_count > 0 && (
                                <span
                                    aria-label={`${conversation.unread_count} mensajes no leidos`}
                                    className="absolute -bottom-1 -right-1 min-w-4 h-4 px-1 text-[10px] leading-4 text-center font-semibold text-app-on-accent rounded-full ring-2 ring-white"
                                    style={{ backgroundColor: 'var(--app-accent)' }}
                                >
                                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline gap-2">
                                <h3 className="text-[15px] truncate transition-colors duration-200 font-semibold text-app-primary group-hover:text-bluvi-purple">
                                    {conversation.first_name} {conversation.last_name}
                                </h3>
                                <span className="text-[11px] text-app-muted flex-shrink-0 font-medium">
                                    {formatTime(conversation.last_message_at)}
                                </span>
                            </div>
                            <p className="text-[13px] truncate mt-0.5 text-app-muted italic">
                                {conversation.last_message || 'Empieza la conversación'}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}

            {conversations.length === 0 && (
                <li className="text-sm text-app-secondary">Aun no tienes conversaciones activas.</li>
            )}
        </ul>
    </section>
);

export const Messages: React.FC = () => {
    const [requests, setRequests] = useState<IncomingMatchRequest[]>([]);
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { refreshNotifications } = useNotifications();

    const loadData = async (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }

        try {
            const [incoming, activeConversations] = await Promise.all([
                getIncomingMatchRequests(),
                getConversations(),
            ]);
            setRequests(incoming);
            setConversations(activeConversations);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadData(true);

        const intervalId = window.setInterval(() => {
            loadData();
        }, 15000);

        const socket = connectRealtime();

        const handleRealtimeUpdate = () => {
            loadData();
        };

        socket?.on('match:request:new', handleRealtimeUpdate);
        socket?.on('match:accepted', handleRealtimeUpdate);
        socket?.on('chat:message:new', handleRealtimeUpdate);
        socket?.on('chat:messages:read', handleRealtimeUpdate);

        return () => {
            window.clearInterval(intervalId);
            socket?.off('match:request:new', handleRealtimeUpdate);
            socket?.off('match:accepted', handleRealtimeUpdate);
            socket?.off('chat:message:new', handleRealtimeUpdate);
            socket?.off('chat:messages:read', handleRealtimeUpdate);
            disconnectRealtime();
        };
    }, []);

    const handleRespond = async (idRequest: number, action: 'accept' | 'reject') => {
        try {
            await respondToMatchRequest(idRequest, action);
            await loadData();
            await refreshNotifications();
        } catch (error) {
            console.error('Error respondiendo solicitud:', error);
        }
    };

    if (loading) {
        return <div className="pt-16 text-center text-app-primary font-medium">Cargando mensajes...</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-4 animate-fade-in motion-reduce:animate-none">

        <header className="mb-4">
            <h1 className="text-3xl font-bold text-app-primary leading-tight">
                Mensajes
            </h1>
            {requests.length > 0 && (
                <p className="text-app-secondary text-sm mt-1.5">
                    {requests.length} solicitudes nuevas esperándote
                </p>
            )}
        </header>

        <main className="flex flex-col gap-10">
            <MatchesSection requests={requests} onRespond={handleRespond} />
            <div aria-hidden="true" className="flex items-center gap-3 -my-5">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
                <span className="text-[10px] font-semibold text-app-muted uppercase tracking-widest">
                    activas
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
            </div>

            <ChatsSection conversations={conversations} />
        </main>
    </div>
    );
};
