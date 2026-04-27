import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ShieldOff, Trash2, Flag, ArrowLeft, Send, Check, MoreVertical, Image, Smile, AlertTriangle } from 'lucide-react';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import {
    getConversationMessages,
    markConversationRead,
    markConversationDelivered,
    sendConversationMessage,
    checkUserOnline,
    deleteConversation,
    reportUser,
    blockUser,
    type ChatCounterpart,
    type ChatMessage,
} from '../services/chat.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';

interface RealtimeChatPayload {
    fromUserId: number;
    chatUserId?: number;
    isTyping?: boolean;
    message?: ChatMessage;
    lastReadMessageId?: number;
    byUserId?: number;
}

const PAGE_SIZE = 30;
const TYPING_STOP_DELAY = 1200;
const typingPickerId = 'chat-emoji-picker';

const formatHour = (date: string) =>
    new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export const ChatDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const chatUserId = Number(id);

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [counterpart, setCounterpart] = useState<ChatCounterpart | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [sending, setSending] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isTypingRemote, setIsTypingRemote] = useState(false);
    const [isRemoteUserOnline, setIsRemoteUserOnline] = useState(false);
    const [canShowOnlineStatus, setCanShowOnlineStatus] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isBlockedByMe, setIsBlockedByMe] = useState(false);
    const [isBlockedByOther, setIsBlockedByOther] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isReporting, setIsReporting] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const typingStopTimerRef = useRef<number | null>(null);
    const isPrependingRef = useRef(false);

    const currentUserRaw = localStorage.getItem('user');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) as { id?: number } : null;
    const currentUserId = Number(currentUser?.id);
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sendTypingState = (isTyping: boolean) => {
        const socket = connectRealtime();
        socket?.emit(isTyping ? 'chat:typing' : 'chat:typing:stop', {
            toUserId: chatUserId,
            chatUserId,
            isTyping,
        });
    };

    const scheduleStopTyping = () => {
        if (typingStopTimerRef.current) {
            window.clearTimeout(typingStopTimerRef.current);
        }

        typingStopTimerRef.current = window.setTimeout(() => {
            sendTypingState(false);
        }, TYPING_STOP_DELAY);
    };

    const handleEmojiClick = (emojiData: EmojiClickData): void => {
        setInputText((prev) => prev + emojiData.emoji);
        setShowPicker(false);
        inputRef.current?.focus();
        sendTypingState(true);
        scheduleStopTyping();
    };

    const loadInitialConversation = async () => {
        if (!Number.isInteger(chatUserId) || chatUserId <= 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getConversationMessages(chatUserId, PAGE_SIZE);
            setCounterpart(response.counterpart);
            setMessages(response.messages || []);
            setHasMore(Boolean(response.hasMore));
            setIsBlockedByMe(Boolean((response as any).isBlockedByMe));
            setIsBlockedByOther(Boolean((response as any).isBlockedByOther));
            
            // Consultar estado online del otro usuario
            const onlineStatus = await checkUserOnline(chatUserId);
            setIsRemoteUserOnline(onlineStatus.isOnline);
            setCanShowOnlineStatus(onlineStatus.canShowOnlineStatus);
            
            await markConversationRead(chatUserId);
        } catch (error) {
            console.error('Error cargando conversación:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOlderMessages = async () => {
        if (!hasMore || loadingOlder || messages.length === 0) {
            return;
        }

        const container = scrollContainerRef.current;
        if (!container) {
            return;
        }

        const previousScrollTop = container.scrollTop;
        const previousScrollHeight = container.scrollHeight;
        const oldestMessageId = messages[0]?.id_message;
        if (!oldestMessageId) {
            return;
        }

        try {
            setLoadingOlder(true);
            const response = await getConversationMessages(chatUserId, PAGE_SIZE, oldestMessageId);
            const olderMessages = response.messages || [];

            if (olderMessages.length > 0) {
                isPrependingRef.current = true;
                setMessages((prev) => {
                    const existingIds = new Set(prev.map((message) => message.id_message));
                    const filteredOlder = olderMessages.filter((message) => !existingIds.has(message.id_message));
                    return [...filteredOlder, ...prev];
                });

                window.requestAnimationFrame(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
                    isPrependingRef.current = false;
                });
            }

            setHasMore(Boolean(response.hasMore));
        } catch (error) {
            console.error('Error cargando mensajes antiguos:', error);
        } finally {
            setLoadingOlder(false);
        }
    };

    const handleSendMessage = async () => {
        const cleaned = inputText.trim();
        if (!cleaned || sending || !Number.isInteger(chatUserId) || chatUserId <= 0) {
            return;
        }

        try {
            setSending(true);
            const sent = await sendConversationMessage(chatUserId, cleaned);
            setMessages((prev) => [...prev, { ...sent, is_read: false, is_delivered: false }]);
            setInputText('');
            if (inputRef.current) {
                inputRef.current.style.height = '24px';
            }
            sendTypingState(false);
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('No se pudo enviar el mensaje. Inténtalo de nuevo.');
        } finally {
            setSending(false);
        }
    };

    const handleEnterSend = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSendMessage();
        }
    };

    const handleDeleteConversation = async () => {
        const shouldBlock = window.confirm('¿Quieres borrar la conversación y BLOQUEAR a este usuario?');
        const confirmDelete = shouldBlock || window.confirm('¿Estás seguro de que quieres borrar toda la conversación?');
        
        if (!confirmDelete) return;

        try {
            await deleteConversation(chatUserId, shouldBlock);
            navigate('/app/messages');
        } catch (error) {
            console.error('Error borrando conversación:', error);
            alert('No se pudo procesar la solicitud.');
        }
    };

    const handleBlockUser = () => {
        setShowOptions(false);
        setShowBlockModal(true);
    };

    const confirmBlock = async () => {
        setIsBlocking(true);
        try {
            await blockUser(chatUserId);
            setIsBlockedByMe(true);
            setShowBlockModal(false);
        } catch (error) {
            console.error('Error bloqueando usuario:', error);
            alert('No se pudo bloquear al usuario.');
        } finally {
            setIsBlocking(false);
        }
    };

    const handleReportUser = () => {
        setShowOptions(false);
        setShowReportModal(true);
    };

    const confirmReport = async () => {
        if (!reportReason.trim()) return;
        
        setIsReporting(true);
        try {
            await reportUser(chatUserId, reportReason);
            setReportSuccess(true);
            setReportReason('');
        } catch (error) {
            console.error('Error denunciando usuario:', error);
            alert('No se pudo enviar la denuncia.');
        } finally {
            setIsReporting(false);
        }
    };

    const handleInputChange = (value: string) => {
        setInputText(value);
        sendTypingState(value.trim().length > 0);
        scheduleStopTyping();
    };

    useEffect(() => {
        void loadInitialConversation();
    }, [chatUserId]);

    useEffect(() => {
        const socket = connectRealtime();

        const onTyping = (payload: RealtimeChatPayload) => {
            if (payload.fromUserId !== chatUserId) {
                return;
            }
            setIsTypingRemote(Boolean(payload.isTyping));
        };

        const onMessage = async (payload: RealtimeChatPayload) => {
            const incomingMessage = payload?.message;
            if (!incomingMessage) return;

            const belongsToCurrentChat = payload.fromUserId === chatUserId || incomingMessage.sender_id === chatUserId;
            if (!belongsToCurrentChat) return;

            setMessages((prev) => {
                const alreadyExists = prev.some((msg) => msg.id_message === incomingMessage.id_message);
                const normalizedMessage: ChatMessage = { ...incomingMessage, is_read: false, is_delivered: true };
                return alreadyExists ? prev : [...prev, normalizedMessage];
            });

            if (incomingMessage.sender_id === chatUserId) {
                setIsTypingRemote(false);
                try {
                    await markConversationDelivered(chatUserId);
                    await markConversationRead(chatUserId);
                } catch (error) {
                    console.error('Error marcando lectura/entrega:', error);
                }
            }
        };

        const onRead = (payload: any) => {
            if (payload.byUserId !== chatUserId || !payload.lastReadMessageId) {
                return;
            }

            setMessages((prev) =>
                prev.map((message) =>
                    message.sender_id === currentUserId && message.id_message <= Number(payload.lastReadMessageId)
                        ? { ...message, is_read: true, is_delivered: true }
                        : message
                )
            );
        };

        const onDelivered = (payload: any) => {
            if (payload.byUserId !== chatUserId || !payload.lastDeliveredMessageId) {
                return;
            }

            setMessages((prev) =>
                prev.map((message) =>
                    message.sender_id === currentUserId && message.id_message <= Number(payload.lastDeliveredMessageId)
                        ? { ...message, is_delivered: true }
                        : message
                )
            );
        };

        socket?.on('chat:typing', onTyping);
        socket?.on('chat:message:new', onMessage);
        socket?.on('chat:messages:read', onRead);
        socket?.on('chat:messages:delivered', onDelivered);

        const onUserOnline = (payload: { userId: number }) => {
            if (!canShowOnlineStatus) {
                return;
            }

            if (payload.userId === chatUserId) {
                setIsRemoteUserOnline(true);
            }
        };

        const onUserOffline = (payload: { userId: number }) => {
            if (!canShowOnlineStatus) {
                return;
            }

            if (payload.userId === chatUserId) {
                setIsRemoteUserOnline(false);
            }
        };

        socket?.on('user:online', onUserOnline);
        socket?.on('user:offline', onUserOffline);

        return () => {
            socket?.off('chat:typing', onTyping);
            socket?.off('chat:message:new', onMessage);
            socket?.off('chat:messages:read', onRead);
            socket?.off('chat:messages:delivered', onDelivered);
            socket?.off('user:online', onUserOnline);
            socket?.off('user:offline', onUserOffline);
            disconnectRealtime();
        };
    }, [chatUserId, currentUserId, canShowOnlineStatus]);

    const hasInitiallyScrolled = useRef(false);
    useEffect(() => {
        if (loading || isPrependingRef.current) {
            return;
        }

        const behavior = (reduceMotion || !hasInitiallyScrolled.current) ? 'auto' : 'smooth';
        messagesEndRef.current?.scrollIntoView({ behavior });
        
        if (messages.length > 0) {
            hasInitiallyScrolled.current = true;
        }
    }, [messages, isTypingRemote, loading]);

    useEffect(() => {
        const handleClickOutside = () => setShowOptions(false);
        if (showOptions) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => {
            window.removeEventListener('click', handleClickOutside);
            if (typingStopTimerRef.current) {
                window.clearTimeout(typingStopTimerRef.current);
            }
            sendTypingState(false);
        };
    }, [showOptions]);

    if (!Number.isInteger(chatUserId) || chatUserId <= 0) {
        return <div className="pt-20 text-center text-app-primary font-medium">Chat no válido.</div>;
    }

    if (loading) {
        return <div className="pt-20 text-center text-app-primary font-medium">Cargando conversación...</div>;
    }

    return (
        <div className="flex justify-center h-[100svh]">
            <div className="flex flex-col w-full max-w-[95%]">
                <header className="flex-none z-50 bg-app-surface-strong backdrop-blur-md border-b rounded-2xl border-app-soft px-5 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Volver a la lista de conversaciones"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-app-surface-soft text-app-accent transition-all active:scale-90 focus-visible:outline-none"
                        >
                            <ArrowLeft size={22} strokeWidth={2} />
                        </button>

                        <Link 
                            to={`/app/user/${chatUserId}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-2xl px-1 py-1"
                        >
                            <div className="relative">
                                <img
                                    src={(isBlockedByMe || isBlockedByOther) ? 'https://via.placeholder.com/120?text=?' : (counterpart?.main_photo || 'https://via.placeholder.com/120')}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-app-soft"
                                    alt={counterpart?.first_name || 'Usuario'}
                                />
                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-app-surface transition-colors ${canShowOnlineStatus && isRemoteUserOnline && !isBlockedByMe && !isBlockedByOther ? 'bg-green-400' : 'bg-gray-400'}`} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[15px] font-semibold text-app-primary leading-tight">
                                    {(isBlockedByMe || isBlockedByOther) ? 'Usuario' : (counterpart ? `${counterpart.first_name} ${counterpart.last_name}` : 'Chat')}
                                </h2>
                                <span className="text-[11px] font-medium" aria-live="polite" role="status">
                                    {isTypingRemote && !isBlockedByMe && !isBlockedByOther ? (
                                        <span className="text-app-secondary">escribiendo…</span>
                                    ) : (isBlockedByMe || isBlockedByOther || !canShowOnlineStatus) ? (
                                        <span className="text-app-muted">Estado no disponible</span>
                                    ) : isRemoteUserOnline ? (
                                        <span className="text-green-600">Conectada/o</span>
                                    ) : (
                                        <span className="text-app-muted">Desconectada/o</span>
                                    )}
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-app-muted hover:bg-app-surface-soft hover:text-app-primary transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                            aria-label="Más opciones del chat"
                        >
                            <MoreVertical size={20} strokeWidth={1.8} />
                        </button>

                        {showOptions && (
                            <div className="absolute right-0 top-12 w-56 bg-app-surface-strong border border-app-soft rounded-2xl shadow-xl z-50 overflow-hidden animate-navbar-menu">
                                <div className="py-2">
                                    <button
                                        onClick={() => void handleReportUser()}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-app-primary hover:bg-app-surface-soft transition-colors"
                                    >
                                        <Flag size={16} className="text-app-muted" />
                                        Denunciar usuario
                                    </button>
                                    {!isBlockedByMe && (
                                        <button
                                            onClick={() => void handleBlockUser()}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-app-primary hover:bg-app-surface-soft transition-colors"
                                        >
                                            <ShieldOff size={16} className="text-app-muted" />
                                            Bloquear usuario
                                        </button>
                                    )}
                                    <div className="h-px bg-app-soft mx-4 my-1" />
                                    <button
                                        onClick={() => void handleDeleteConversation()}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Borrar conversación
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main
                    ref={(node) => {
                        scrollContainerRef.current = node;
                    }}
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions text"
                    aria-label={`Mensajes con ${counterpart ? `${counterpart.first_name} ${counterpart.last_name}` : 'usuario'}`}
                    onScroll={(event) => {
                        const element = event.currentTarget;
                        if (element.scrollTop < 120 && hasMore && !loadingOlder) {
                            void loadOlderMessages();
                        }
                    }}
                    className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-2 focus:outline-none scrollbar-hide"
                    tabIndex={0}
                >
                    {loadingOlder && (
                        <div className="text-center text-xs text-app-muted py-2" aria-live="polite">Cargando mensajes anteriores...</div>
                    )}

                    <div className="flex items-center gap-3 my-4" aria-hidden="true">
                        <div className="flex-1 h-px border-t border-app-soft" />
                        <span className="text-[11px] text-app-muted font-medium tracking-wide uppercase">Hoy</span>
                        <div className="flex-1 h-px border-t border-app-soft" />
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const prevMsg = messages[index - 1];
                        const isSameSender = prevMsg?.sender_id === msg.sender_id;
                        const isRead = Boolean(msg.is_read);

                        return (
                            <div
                                key={msg.id_message}
                                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mt-1' : 'mt-3'}`}
                            >
                                {!isMe && (
                                    <div className="w-7 flex-none">
                                        {(!messages[index + 1] || messages[index + 1].sender_id === currentUserId) && (
                                            <img
                                                src={counterpart?.main_photo || 'https://via.placeholder.com/120'}
                                                className="w-7 h-7 rounded-full object-cover ring-1 ring-app-soft"
                                                alt={counterpart?.first_name || 'Usuario'}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    <div
                                        className={`
                                                px-4 py-2.5 text-[15px] leading-7
                                            ${isMe
                                                    ? 'text-app-on-accent rounded-2xl rounded-br-md shadow-md'
                                                    : 'bg-app-surface text-app-primary rounded-2xl rounded-bl-md shadow-sm border border-app-soft'
                                            }
                                        `}
                                        style={{
                                            overflowWrap: 'anywhere',
                                            ...(isMe ? { backgroundColor: 'var(--app-accent)' } : {}),
                                        }}
                                    >
                                        {msg.content}
                                    </div>

                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[11px] text-app-muted mr-1">{formatHour(msg.created_at)}</span>
                                        {isMe && (
                                            isRead ? (
                                                <span className="flex" aria-label="Leído">
                                                    <Check size={13} strokeWidth={3} style={{ color: '#34B7F1' }} />
                                                    <Check size={13} strokeWidth={3} style={{ color: '#34B7F1', marginLeft: '-8px' }} />
                                                </span>
                                            ) : msg.is_delivered ? (
                                                <span className="flex" aria-label="Entregado">
                                                    <Check size={13} strokeWidth={3} className="text-app-muted" />
                                                    <Check size={13} strokeWidth={3} className="text-app-muted" style={{ marginLeft: '-8px' }} />
                                                </span>
                                            ) : (
                                                <Check size={13} strokeWidth={3} className="text-app-muted" aria-label="Enviado" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTypingRemote && (
                        <div className="flex items-end gap-2.5 mt-4 animate-fade-in">
                            <div className="w-7 flex-none">
                                <img
                                    src={counterpart?.main_photo || 'https://via.placeholder.com/120'}
                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-app-soft"
                                    alt=""
                                />
                            </div>
                            <div className="bg-app-surface border border-app-soft px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-app-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-app-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-app-muted rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </main>

                <div className="flex-none px-4 pb-6 pt-2 bg-app-surface-nav backdrop-blur-xl rounded-2xl border-t border-app-soft">
                    {(isBlockedByMe || isBlockedByOther) ? (
                        <div className="flex items-center justify-center py-4 px-6 bg-app-surface rounded-2xl border border-app-soft border-dashed">
                            <p className="text-sm text-app-muted font-medium italic">
                                {isBlockedByMe ? 'Has bloqueado a este usuario. Desbloquéalo para enviar mensajes.' : 'Ya no puedes enviar mensajes a este usuario.'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-end gap-2">
                            <div className="flex gap-1 pb-2">
                                <button className="w-10 h-10 flex items-center justify-center text-app-muted hover:text-app-primary hover:bg-app-surface-soft rounded-full transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20" aria-label="Adjuntar imagen">
                                    <Image size={20} strokeWidth={1.8} />
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowPicker((o) => !o)}
                                        aria-controls={typingPickerId}
                                        aria-expanded={showPicker}
                                        aria-label="Abrir selector de emoji"
                                        className="w-10 h-10 flex items-center justify-center text-app-muted hover:text-app-primary hover:bg-app-surface-soft rounded-full transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                                    >
                                        <Smile size={20} strokeWidth={1.8} />
                                    </button>

                                    {showPicker && (
                                        <div id={typingPickerId} className="absolute bottom-12 left-0 z-50">
                                            <EmojiPicker
                                                onEmojiClick={handleEmojiClick}
                                                theme={Theme.LIGHT}
                                                lazyLoadEmojis={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 bg-app-surface border border-app-soft rounded-2xl px-4 py-2.5 shadow-sm flex items-end gap-2">
                                <textarea
                                    rows={1}
                                    placeholder="Escribe un mensaje..."
                                    aria-label="Escribe un mensaje"
                                    value={inputText}
                                    ref={inputRef}
                                    onChange={(event) => {
                                        handleInputChange(event.target.value);
                                        event.target.style.height = 'auto';
                                        event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
                                    }}
                                    onKeyDown={handleEnterSend}
                                    className="flex-1 bg-transparent outline-none text-app-primary placeholder:text-app-muted text-[15px] resize-none leading-relaxed max-h-[120px] overflow-y-auto"
                                    style={{ minHeight: '24px' }}
                                />
                            </div>

                            <button
                                onClick={() => void handleSendMessage()}
                                aria-label="Enviar mensaje"
                                className={`w-11 h-11 flex items-center justify-center rounded-full shadow-md transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/30 ${inputText.trim() ? 'text-app-on-accent' : 'bg-app-surface-soft text-app-muted'}`}
                                style={inputText.trim() ? { backgroundColor: 'var(--app-accent)' } : undefined}
                                disabled={!inputText.trim() || sending}
                            >
                                <Send size={18} strokeWidth={2} className={inputText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Modal de Bloqueo */}
            {showBlockModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => !isBlocking && setShowBlockModal(false)}
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm border border-red-100">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-app-primary mb-3">¿Bloquear a {counterpart?.first_name}?</h3>
                            <p className="text-sm text-app-muted leading-relaxed mb-8">
                                No podrá enviarte mensajes ni ver tu perfil. Podrás desbloquearlo en cualquier momento desde los ajustes.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowBlockModal(false)}
                                    disabled={isBlocking}
                                    className="px-6 py-3.5 text-sm font-semibold text-app-primary bg-app-surface-soft hover:bg-app-soft rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => void confirmBlock()}
                                    disabled={isBlocking}
                                    className="px-6 py-3.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all active:scale-95 shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isBlocking ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Bloquear'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Reporte */}
            {showReportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => !isReporting && setShowReportModal(false)}
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        {reportSuccess ? (
                            <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-100 shadow-sm">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-bold text-app-primary mb-3">¡Reporte enviado!</h3>
                                <p className="text-sm text-app-muted leading-relaxed mb-8">
                                    Gracias por ayudarnos a mantener Bluvi seguro. Revisaremos tu reporte lo antes posible.
                                </p>
                                <button
                                    onClick={() => {
                                        setShowReportModal(false);
                                        setReportSuccess(false);
                                    }}
                                    className="w-full py-4 text-sm font-bold text-white bg-app-accent hover:opacity-90 rounded-2xl transition-all active:scale-95 shadow-lg shadow-app-accent/20"
                                    style={{ backgroundColor: 'var(--app-accent)' }}
                                >
                                    Entendido
                                </button>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100">
                                    <Flag size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-app-primary mb-3 text-center">Denunciar a {counterpart?.first_name}</h3>
                                <p className="text-sm text-app-muted leading-relaxed mb-6 text-center">
                                    Cuéntanos qué ha pasado. Revisaremos tu reporte para mantener la comunidad segura.
                                </p>
                                
                                <div className="space-y-4 mb-8">
                                    <textarea
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder="Escribe el motivo de la denuncia..."
                                        className="w-full h-32 px-4 py-3 text-sm bg-app-surface-soft border border-app-soft rounded-2xl focus:ring-2 focus:ring-bluvi-purple/20 focus:border-bluvi-purple outline-none transition-all resize-none"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {['Spam', 'Acoso', 'Contenido inapropiado', 'Falso perfil'].map((reason) => (
                                            <button
                                                key={reason}
                                                onClick={() => setReportReason(reason)}
                                                className="px-3 py-1.5 text-xs font-medium bg-app-surface-soft hover:bg-app-soft text-app-secondary rounded-full border border-app-soft transition-colors"
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setShowReportModal(false);
                                            setReportSuccess(false);
                                        }}
                                        disabled={isReporting}
                                        className="px-6 py-3.5 text-sm font-semibold text-app-primary bg-app-surface-soft hover:bg-app-soft rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => void confirmReport()}
                                        disabled={isReporting || !reportReason.trim()}
                                        className="px-6 py-3.5 text-sm font-bold text-white bg-[#3f4292] hover:opacity-90 rounded-2xl transition-all active:scale-95 shadow-md shadow-[#3f4292]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                        style={{ backgroundColor: '#3f4292' }}
                                    >
                                        {isReporting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Enviar'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
