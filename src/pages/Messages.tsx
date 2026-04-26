import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
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
                aria-label={`${requests.length} ${requests.length === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}`}
                className="text-[10px] font-black uppercase tracking-wider bg-app-accent/10 text-app-accent-strong px-3 py-1 rounded-full border border-app-accent/20"
            >
                {requests.length} {requests.length === 1 ? 'nueva' : 'nuevas'}
            </span>
        </div>

        <div 
            role="list" 
            aria-label="Solicitudes de conexión" 
            className="flex flex-row gap-4 py-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        >
            {requests.length === 0 && (
                <p className="text-sm text-app-secondary px-2">No tienes solicitudes pendientes ahora mismo.</p>
            )}

            {requests.map((request) => (
                <div 
                    key={request.id_match} 
                    role="listitem"
                    className="flex-none w-[280px] sm:w-[320px] snap-center bg-app-surface/80 dark:bg-app-surface-strong/60 border border-white dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                >
                    <Link to={`/app/user/${request.id_user}`} className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/50 rounded-2xl">
                        <div className="relative overflow-hidden rounded-2xl flex-shrink-0 shadow-inner">
                            <img
                                src={request.main_photo || 'https://via.placeholder.com/120'}
                                alt={request.first_name}
                                className="w-14 h-14 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-bold text-app-primary truncate transition-colors duration-200 group-hover:text-app-accent">
                                {request.first_name} {request.last_name}
                            </p>
                            <p className="text-[11px] text-app-muted mt-0.5 font-medium uppercase tracking-wider">{formatTime(request.created_at)}</p>
                        </div>
                    </Link>

                    <div 
                        style={{ backgroundColor: 'white' }}
                        className="mt-4 p-4 dark:!bg-app-pill/80 rounded-2xl italic text-[13.5px] text-app-secondary line-clamp-2 min-h-[3.5rem] flex items-center justify-center text-center leading-relaxed shadow-md border border-app-soft/30"
                    >
                        "{request.message}"
                    </div>

                    <div className="flex gap-2.5 mt-5">
                        <button
                            onClick={() => onRespond(request.id_match, 'reject')}
                            className="flex-1 rounded-2xl border border-app-soft bg-app-surface-soft/80 py-2.5 text-xs font-bold text-app-secondary hover:bg-app-surface-strong transition-all active:scale-95"
                        >
                            Pasar
                        </button>
                        <button
                            onClick={() => onRespond(request.id_match, 'accept')}
                            className="flex-1 rounded-2xl bg-app-accent py-2.5 text-xs font-bold text-white hover:opacity-90 shadow-lg shadow-app-accent/20 transition-all active:scale-95"
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
        <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
                <MessageCircle size={16} className="text-app-accent dark:text-app-orange" aria-hidden="true" />
                <h2
                    id="chats-heading"
                    className="text-[12px] font-black text-app-secondary/80 uppercase tracking-[0.15em]"
                >
                    Conversaciones
                </h2>
            </div>
            {conversations.length > 0 && (
                <span
                    aria-label={`Tienes ${conversations.length} ${conversations.length === 1 ? 'conversación activa' : 'conversaciones activas'}`}
                    className="text-[10px] font-black uppercase tracking-wider bg-app-accent/10 text-app-accent-strong px-3 py-1 rounded-full border border-app-accent/20"
                >
                    {conversations.length} {conversations.length === 1 ? 'activa' : 'activas'}
                </span>
            )}
        </div>

        <ul aria-label="Lista de conversaciones" className="flex flex-col gap-2.5">
            {conversations.map((conversation) => (
                <li key={conversation.chat_id}>
                    <Link
                        to={`/app/chat/${conversation.id_user}`}
                        aria-label={`
                            Chat con ${conversation.first_name} ${conversation.last_name}.
                            Último mensaje: ${conversation.last_message || 'Sin mensajes todavía'}
                        `}
                        className="flex items-center gap-4 p-4 rounded-[22px] bg-app-surface/80 dark:bg-app-surface-strong/60 border border-white dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/20"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="relative overflow-hidden rounded-[18px] shadow-inner">
                                <img
                                    src={conversation.main_photo || 'https://via.placeholder.com/120'}
                                    alt=""          
                                    className="w-16 h-16 object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            {conversation.unread_count > 0 && (
                                <span
                                    aria-label={`${conversation.unread_count} mensajes no leídos`}
                                    className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center px-1.5 text-[11px] font-black text-white rounded-full ring-4 ring-app-surface-solid bg-app-accent dark:bg-app-orange shadow-lg shadow-app-accent/20"
                                >
                                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2 mb-1">
                                <h3 className="text-[16px] font-bold text-app-primary truncate transition-colors duration-200 group-hover:text-app-accent">
                                    {conversation.first_name} {conversation.last_name}
                                </h3>
                                <span className="text-[11px] text-app-muted flex-shrink-0 font-bold uppercase tracking-tight">
                                    {formatTime(conversation.last_message_at)}
                                </span>
                            </div>
                            <p className="text-[13.5px] truncate text-app-secondary font-medium leading-normal">
                                {conversation.unread_count > 0 ? (
                                    <span className="text-app-accent dark:text-app-orange font-bold mr-1">●</span>
                                ) : null}
                                {conversation.last_message || 'Empieza la conversación'}
                            </p>
                        </div>
                        
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <ArrowRight size={18} className="text-app-accent/40" />
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

    const handleRespond = async (idMatch: number, action: 'accept' | 'reject') => {
        try {
            await respondToMatchRequest(idMatch, action);
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
                    {requests.length} {requests.length === 1 ? 'solicitud nueva' : 'solicitudes nuevas'} esperándote
                </p>
            )}
        </header>

        <main className="flex flex-col gap-10">
            <MatchesSection requests={requests} onRespond={handleRespond} />
            <div aria-hidden="true" className="flex items-center gap-3 -my-5">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
                <span className="text-[10px] font-semibold text-app-muted uppercase tracking-widest">
                    {conversations.length === 1 ? 'activa' : 'activas'}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
            </div>

            <ChatsSection conversations={conversations} />
        </main>
    </div>
    );
};
