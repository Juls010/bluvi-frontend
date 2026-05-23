import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Link } from 'react-router-dom';
import { 
    ChatCircleIcon,
    ArrowRightIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    XIcon,
    AddressBookIcon,
    GhostIcon,
    ImageIcon
} from '@phosphor-icons/react';
import {
    getIncomingMatchRequests,
    respondToMatchRequest,
    getMyMatches,
    type IncomingMatchRequest,
    type MatchItem,
} from '../services/match.service';
import { getConversations, type ConversationItem } from '../services/chat.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';
import { useNotifications } from '../context/NotificationContext';
import { Tooltip, TooltipTrigger, Button as AriaButton } from '../components/Tooltip';
import { VerifiedIdentityIcon } from '../components/VerifiedIdentityIcon';

const formatTime = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
};

const MatchesSection: React.FC<{ requests: IncomingMatchRequest[]; onRespond: (id: number, action: 'accept' | 'reject') => void }> = ({ requests, onRespond }) => (
    <section aria-labelledby="matches-heading">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h2
                    id="matches-heading"
                    className="text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: 'var(--app-messages-accent)' }}
                >
                    Nuevas conexiones
                </h2>
            </div>
            {requests.length > 0 && (
                <span
                    aria-label={`${requests.length} ${requests.length === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}`}
                    className="text-[10px] font-black uppercase tracking-wider bg-app-accent/10 text-app-accent-strong px-3 py-1 rounded-full border border-app-accent/20"
                >
                    {requests.length} {requests.length === 1 ? 'nueva' : 'nuevas'}
                </span>
            )}
        </div>

        <div
            role="list"
            aria-label="Solicitudes de conexión"
            className="flex flex-row gap-4 py-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        >
            {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full py-8 text-center bg-app-surface/30 rounded-3xl border border-dashed border-app-soft">
                    <GhostIcon size={32} weight="bold" className="text-app-muted mb-2 opacity-90" />
                    <p className="text-xs font-bold text-app-muted uppercase tracking-widest">No hay peticiones nuevas</p>
                </div>
            )}

            {requests.map((request) => (
                <div
                    key={request.id_match}
                    role="listitem"
                    className="flex-none w-[280px] sm:w-[320px] snap-center rounded-3xl border border-app-soft bg-app-surface p-5 shadow-sm"
                >
                    <Link to={`/app/user/${request.id_user}`} className="group flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/70 focus-visible:ring-offset-2">
                        <div className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-app-soft shadow-sm">
                            <img
                                src={request.main_photo || 'https://via.placeholder.com/120'}
                                alt={request.first_name}
                                className="w-14 h-14 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-[15px] font-bold text-app-primary truncate transition-colors duration-200 group-hover:text-app-accent">
                                    {request.first_name} {request.last_name}
                                </p>
                                {request.is_face_verified && (
                                    <VerifiedIdentityIcon
                                        variant="static"
                                        className="flex-shrink-0"
                                        iconClassName="h-4.5 w-4.5"
                                    />
                                )}
                            </div>
                            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-app-muted">{formatTime(request.created_at)}</p>
                        </div>
                    </Link>

                    <div className="mt-4 flex min-h-[4rem] items-center justify-center rounded-2xl border border-app-soft bg-app-surface-soft px-4 py-3 text-center text-[13.5px] font-medium italic leading-relaxed text-app-secondary">
                        "{request.message}"
                    </div>

                    <div className="mt-5 flex gap-2.5">
                        <button
                            onClick={() => onRespond(request.id_match, 'reject')}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-app-soft bg-app-surface-soft py-2.5 text-xs font-bold text-app-secondary transition-all duration-300 ease-out hover:border-red-300 hover:bg-red-400 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200/50"
                        >
                            <XIcon size={14} weight="bold" />
                            Pasar
                        </button>
                        <button
                            onClick={() => onRespond(request.id_match, 'accept')}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-app-accent py-2.5 text-xs font-bold text-app-on-accent shadow-md transition-all duration-300 ease-out hover:bg-emerald-500 hover:text-white hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
                        >
                            <CheckIcon size={14} weight="bold" />
                            Aceptar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const ContactsDrawer: React.FC<{ isOpen: boolean; onClose: () => void; matches: MatchItem[]; onlineUsers: Set<number> }> = ({ isOpen, onClose, matches, onlineUsers }) => {
    const [search, setSearch] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    const filteredMatches = matches.filter(m => 
        m.first_name.toLowerCase().includes(search.toLowerCase()) || 
        m.last_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'Tab') {
                const drawer = drawerRef.current;
                if (!drawer) return;
                const focusable = Array.from(
                    drawer.querySelectorAll<HTMLElement>(
                        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
                    )
                ).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
                
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const searchInput = drawerRef.current?.querySelector('input');
        if (searchInput) searchInput.focus();

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-start p-0">
            <div 
                className={`absolute inset-0 bg-black/40 dark:bg-black/70 z-0 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleClose}
                aria-hidden="true"
            />
            <div 
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contacts-drawer-title"
                className={`relative z-10 w-full bg-app-surface-solid text-app-primary shadow-2xl overflow-hidden border-r border-app-soft flex flex-col md:w-[420px] md:bg-app-surface ${isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'} rounded-t-[40px] md:rounded-t-none md:rounded-r-[48px]`}
            >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1 bg-app-accent/70" aria-hidden="true" />
                <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
                    <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                </div>

                <div className="px-6 pt-4 pb-4 md:px-8 md:pt-8 md:pb-6">
                    <header className="mb-6 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 id="contacts-drawer-title" className="text-2xl md:text-3xl font-heading font-bold text-app-primary tracking-tight">Contactos</h2>
                            <p className="text-xs md:text-sm text-app-secondary mt-1 font-medium">Tus conexiones confirmadas</p>
                        </div>
                        <button 
                            onClick={handleClose}
                            aria-label="Cerrar contactos"
                            className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 mt-0.5 md:mt-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
                            style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                        >
                            <XIcon size={20} weight="bold" />
                        </button>
                    </header>

                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-accent transition-colors" size={18} weight="bold" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Buscar contactos"
                            className="w-full bg-app-surface-soft border-2 border-app-strong rounded-2xl py-3.5 pl-12 pr-4 text-sm text-app-primary placeholder:text-app-muted shadow-sm focus:outline-none focus:ring-4 focus:ring-app-focus/60 focus:border-app-focus transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-8 pt-2 pb-10 space-y-3 custom-scrollbar">
                    {filteredMatches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--filter-icon-bg)' }}>
                                <GhostIcon size={40} weight="bold" style={{ color: 'var(--filter-icon-text)' }} className="opacity-40" />
                            </div>
                            <p className="text-sm text-app-secondary font-medium leading-relaxed">
                                {search ? `No hemos encontrado a ningún "${search}".` : 'Aún no tienes conexiones confirmadas. ¡Sigue explorando perfiles!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {filteredMatches.map(match => (
                                <Link
                                    key={match.id_match}
                                    to={`/app/user/${match.id_user}`}
                                    onClick={handleClose}
                                    aria-label={`Ver perfil de ${match.first_name} ${match.last_name}`}
                                    className="flex items-center gap-4 p-4 rounded-[22px] bg-app-surface-soft border border-app-soft transition-all duration-300 shadow-sm hover:shadow-md hover:bg-app-surface group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/70 focus-visible:ring-offset-2"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-[18px] overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            <img 
                                                src={match.main_photo || 'https://via.placeholder.com/120'} 
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {onlineUsers.has(match.id_user) && (
                                            <span 
                                                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm z-20"
                                                title="Online"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-bold text-app-primary truncate group-hover:text-app-accent transition-colors text-[16px]">
                                                {match.first_name} {match.last_name}
                                            </p>
                                            {match.is_face_verified && (
                                                <VerifiedIdentityIcon
                                                    variant="static"
                                                    className="flex-shrink-0"
                                                    iconClassName="h-4.5 w-4.5"
                                                />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-app-muted font-bold uppercase tracking-tight mt-0.5">Match desde {formatTime(match.created_at)}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-sm bg-app-accent text-app-on-accent border border-app-accent">
                                        <ArrowRightIcon size={16} weight="bold" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatsSection: React.FC<{ conversations: ConversationItem[]; typingUsers: Record<number, boolean>; onlineUsers: Set<number> }> = ({ conversations, typingUsers, onlineUsers }) => (
    <section aria-labelledby="chats-heading">
        <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
                <ChatCircleIcon size={16} weight="bold" className="text-app-accent dark:text-app-orange" aria-hidden="true" />
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
                            Último mensaje: ${conversation.last_message_type === 'audio' ? 'Nota de audio' : conversation.last_message_type === 'image' ? 'Foto' : conversation.last_message || 'Sin mensajes todavía'}
                        `}
                        className="flex items-center gap-4 p-4 rounded-[22px] bg-app-surface/80 dark:bg-app-surface-strong/60 border border-white dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/70 focus-visible:ring-offset-2"
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
                            {onlineUsers.has(conversation.id_user) && (
                                <span 
                                    className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-green-500 border-[3px] border-app-surface-solid rounded-full shadow-md z-20"
                                    title="En línea"
                                />
                            )}

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
                                <div className="flex min-w-0 items-center gap-1.5">
                                    <h3 className="text-[16px] font-bold text-app-primary truncate transition-colors duration-200 group-hover:text-app-accent">
                                        {conversation.first_name} {conversation.last_name}
                                    </h3>
                                    {conversation.is_face_verified && (
                                        <VerifiedIdentityIcon
                                            variant="static"
                                            className="flex-shrink-0"
                                            iconClassName="h-4.5 w-4.5"
                                        />
                                    )}
                                </div>
                                <span className="text-[11px] text-app-muted flex-shrink-0 font-bold uppercase tracking-tight">
                                    {formatTime(conversation.last_message_at)}
                                </span>
                            </div>
                            <p className={`text-[13.5px] truncate leading-normal flex items-center gap-1 ${conversation.unread_count > 0 ? 'text-app-primary font-black' : 'text-app-secondary font-medium'}`}>
                                {conversation.unread_count > 0 ? (
                                    <span className="text-app-accent dark:text-app-orange font-bold mr-1">●</span>
                                ) : null}
                                {conversation.last_message_sender_id === Number(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : null) && (
                                    conversation.last_message_read ? (
                                        <span className="flex flex-shrink-0" aria-label="Leído">
                                            <CheckIcon size={14} weight="bold" style={{ color: '#34B7F1' }} />
                                            <CheckIcon size={14} weight="bold" style={{ color: '#34B7F1', marginLeft: '-9px' }} />
                                        </span>
                                    ) : conversation.last_message_delivered ? (
                                        <span className="flex flex-shrink-0" aria-label="Entregado">
                                            <CheckIcon size={14} weight="bold" className="text-app-muted" />
                                            <CheckIcon size={14} weight="bold" className="text-app-muted" style={{ marginLeft: '-9px' }} />
                                        </span>
                                    ) : (
                                        <CheckIcon size={14} weight="bold" className="text-app-muted flex-shrink-0" aria-label="Enviado" />
                                    )
                                )}
                                <span className="truncate">
                                    {typingUsers[conversation.id_user] && conversation.atmosphere !== 'bajo' ? (
                                        <span className="text-app-accent font-bold animate-pulse">escribiendo…</span>
                                    ) : conversation.last_message_type === 'audio' ? (
                                        <span className="flex items-center gap-1 text-app-secondary">
                                            <span>Nota de audio</span>
                                        </span>
                                    ) : conversation.last_message_type === 'image' ? (
                                        <span className="flex items-center gap-1 text-app-secondary">
                                            <ImageIcon size={14} weight="bold" />
                                            <span>Foto</span>
                                        </span>
                                    ) : (
                                        conversation.last_message || 'Empieza la conversación'
                                    )}
                                </span>
                            </p>
                        </div>

                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <ArrowRightIcon size={18} weight="bold" className="text-app-accent/40" />
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
    const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
    const [requests, setRequests] = useState<IncomingMatchRequest[]>([]);
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [showContacts, setShowContacts] = useState(false);
    const { refreshNotifications } = useNotifications();

    const loadData = async (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }

        try {
            const [incoming, activeConversations, allMatches] = await Promise.all([
                getIncomingMatchRequests(),
                getConversations(),
                getMyMatches(),
            ]);
            setRequests(incoming);
            setConversations(activeConversations);
            setMatches(allMatches);
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

        const handleNewMessage = async (payload: any) => {
            const incomingMessage = payload?.message;
            if (incomingMessage && incomingMessage.sender_id) {
                setTypingUsers(prev => ({ ...prev, [incomingMessage.sender_id]: false }));
                try {
                    const { markConversationDelivered } = await import('../services/chat.service');
                    await markConversationDelivered(incomingMessage.sender_id);
                } catch (err) {
                    console.error('Error confirmando entrega:', err);
                }
            }
            loadData();
        };

        const handleTyping = (payload: any) => {
            if (payload.fromUserId) {
                setTypingUsers(prev => ({ ...prev, [payload.fromUserId]: Boolean(payload.isTyping) }));
            }
        };

        const handleUserOnline = (payload: { userId: number }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.add(payload.userId);
                return next;
            });
        };

        const handleUserOffline = (payload: { userId: number }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(payload.userId);
                return next;
            });
        };

        const handleInitialStatus = (payload: { onlineUserIds: number[] }) => {
            setOnlineUsers(new Set(payload.onlineUserIds));
        };

        socket?.on('match:request:new', handleRealtimeUpdate);
        socket?.on('match:accepted', handleRealtimeUpdate);
        socket?.on('chat:message:new', handleNewMessage);
        socket?.on('chat:message:deleted', handleRealtimeUpdate);
        socket?.on('chat:messages:read', handleRealtimeUpdate);
        socket?.on('chat:messages:delivered', handleRealtimeUpdate);
        socket?.on('chat:typing', handleTyping);
        socket?.on('user:online', handleUserOnline);
        socket?.on('user:offline', handleUserOffline);
        socket?.on('user:status:initial', handleInitialStatus);

        return () => {
            window.clearInterval(intervalId);
            socket?.off('match:request:new', handleRealtimeUpdate);
            socket?.off('match:accepted', handleRealtimeUpdate);
            socket?.off('chat:message:new', handleNewMessage);
            socket?.off('chat:message:deleted', handleRealtimeUpdate);
            socket?.off('chat:messages:read', handleRealtimeUpdate);
            socket?.off('chat:messages:delivered', handleRealtimeUpdate);
            socket?.off('chat:typing', handleTyping);
            socket?.off('user:online', handleUserOnline);
            socket?.off('user:offline', handleUserOffline);
            socket?.off('user:status:initial', handleInitialStatus);
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
        <div className="w-full max-w-5xl mx-auto px-6 py-4 animate-fade-in motion-reduce:animate-none">
            <ContactsDrawer 
                isOpen={showContacts} 
                onClose={() => setShowContacts(false)} 
                matches={matches} 
                onlineUsers={onlineUsers}
            />

            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-app-primary leading-tight">
                        Mensajes
                    </h1>
                    {requests.length > 0 && (
                        <p className="text-app-secondary text-sm mt-1.5">
                            {requests.length} {requests.length === 1 ? 'solicitud nueva' : 'solicitudes nuevas'} esperándote
                        </p>
                    )}
                </div>
                <TooltipTrigger delay={600}>
                    <AriaButton 
                        onPress={() => setShowContacts(true)}
                        className="w-12 h-12 rounded-2xl bg-app-surface border-2 border-app-strong shadow-sm flex items-center justify-center text-app-accent hover:bg-app-surface-soft hover:border-app-strong hover:text-app-primary transition-all duration-500 active:scale-95 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
                        style={{ transitionProperty: 'all' }}
                        aria-label="Ver contactos"
                    >
                        <AddressBookIcon size={24} weight="bold" className="transition-transform group-hover:scale-110" />
                    </AriaButton>
                    <Tooltip>
                        Ver contactos
                    </Tooltip>
                </TooltipTrigger>

            </header>

            <main className="flex flex-col gap-10">
                <MatchesSection requests={requests} onRespond={handleRespond} />
                
                <div aria-hidden="true" className="flex items-center gap-3 -my-5">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
                    <span className="text-[10px] font-semibold text-app-muted uppercase tracking-widest">
                        Tus chats
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--app-border-soft)' }} />
                </div>

                <ChatsSection conversations={conversations} typingUsers={typingUsers} onlineUsers={onlineUsers} />
            </main>
        </div>
    );
};
