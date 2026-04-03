import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Check, MoreVertical, Image, Smile } from 'lucide-react';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import {
    getConversationMessages,
    markConversationRead,
    sendConversationMessage,
    checkUserOnline,
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
    const [showPicker, setShowPicker] = useState(false);

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
            
            // Consultar estado online del otro usuario
            const isOnline = await checkUserOnline(chatUserId);
            setIsRemoteUserOnline(isOnline);
            
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
            setMessages((prev) => [...prev, { ...sent, is_read: false }]);
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
                const normalizedMessage: ChatMessage = { ...incomingMessage, is_read: false };
                return alreadyExists ? prev : [...prev, normalizedMessage];
            });

            if (incomingMessage.sender_id === chatUserId) {
                setIsTypingRemote(false);
                try {
                    await markConversationRead(chatUserId);
                } catch (error) {
                    console.error('Error marcando lectura:', error);
                }
            }
        };

        const onRead = (payload: RealtimeChatPayload) => {
            if (payload.byUserId !== chatUserId || !payload.lastReadMessageId) {
                return;
            }

            setMessages((prev) =>
                prev.map((message) =>
                    message.sender_id === currentUserId && message.id_message <= Number(payload.lastReadMessageId)
                        ? { ...message, is_read: true }
                        : message
                )
            );
        };

        socket?.on('chat:typing', onTyping);
        socket?.on('chat:message:new', onMessage);
        socket?.on('chat:messages:read', onRead);

        const onUserOnline = (payload: { userId: number }) => {
            if (payload.userId === chatUserId) {
                setIsRemoteUserOnline(true);
            }
        };

        const onUserOffline = (payload: { userId: number }) => {
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
            socket?.off('user:online', onUserOnline);
            socket?.off('user:offline', onUserOffline);
            disconnectRealtime();
        };
    }, [chatUserId, currentUserId]);

    useEffect(() => {
        if (isPrependingRef.current) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (typingStopTimerRef.current) {
                window.clearTimeout(typingStopTimerRef.current);
            }
            sendTypingState(false);
        };
    }, []);

    if (!Number.isInteger(chatUserId) || chatUserId <= 0) {
        return <div className="pt-20 text-center text-bluvi-purple font-medium">Chat no válido.</div>;
    }

    if (loading) {
        return <div className="pt-20 text-center text-bluvi-purple font-medium">Cargando conversación...</div>;
    }

    return (
        <div className="flex justify-center h-[100svh]">
            <div className="flex flex-col w-full max-w-[95%]">
                <header className="flex-none z-50 bg-white/90 backdrop-blur-md border-b rounded-2xl border-purple-100/60 px-5 py-3 flex items-center justify-between shadow-sm shadow-purple-100/30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Volver a la lista de conversaciones"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 text-bluvi-purple transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/30"
                        >
                            <ArrowLeft size={22} strokeWidth={2} />
                        </button>

                        <Link 
                            to={`/app/user/${chatUserId}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-2xl px-1 py-1"
                        >
                            <div className="relative">
                                <img
                                    src={counterpart?.main_photo || 'https://via.placeholder.com/120'}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-200"
                                    alt={counterpart?.first_name || 'Usuario'}
                                />
                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white transition-colors ${isRemoteUserOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-[15px] font-semibold text-bluvi-purple leading-tight">
                                    {counterpart ? `${counterpart.first_name} ${counterpart.last_name}` : 'Chat'}
                                </h2>
                                <span className="text-[11px] font-medium" aria-live="polite" role="status">
                                    {isTypingRemote ? (
                                        <span className="text-blue-600">escribiendo…</span>
                                    ) : isRemoteUserOnline ? (
                                        <span className="text-green-600">Conectada/o</span>
                                    ) : (
                                        <span className="text-gray-500">Desconectada/o</span>
                                    )}
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full text-bluvi-purple/50 hover:bg-purple-50 hover:text-bluvi-purple transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20" aria-label="Más opciones del chat">
                            <MoreVertical size={20} strokeWidth={1.8} />
                        </button>
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
                    className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-2 focus:outline-none"
                    tabIndex={0}
                >
                    {loadingOlder && (
                        <div className="text-center text-xs text-bluvi-purple/50 py-2" aria-live="polite">Cargando mensajes anteriores...</div>
                    )}

                    <div className="flex items-center gap-3 my-4" aria-hidden="true">
                        <div className="flex-1 h-px bg-purple-100/70" />
                        <span className="text-[11px] text-bluvi-purple/40 font-medium tracking-wide uppercase">Hoy</span>
                        <div className="flex-1 h-px bg-purple-100/70" />
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
                                                className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-100"
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
                                                    ? 'bg-bluvi-purple text-white rounded-2xl rounded-br-md shadow-md shadow-bluvi-purple/20'
                                                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-purple-100'
                                            }
                                        `}
                                        style={{ overflowWrap: 'anywhere' }}
                                    >
                                        {msg.body}
                                    </div>

                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[11px] text-bluvi-purple/40">{formatHour(msg.created_at)}</span>
                                        {isMe && (
                                            <span className="flex" aria-label={isRead ? 'Leído' : 'Enviado'}>
                                                <Check size={11} className={isRead ? 'text-bluvi-purple' : 'text-bluvi-purple/35'} />
                                                <Check size={11} className={isRead ? 'text-bluvi-purple' : 'text-bluvi-purple/35 -ml-1.5'} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </main>

                <div className="flex-none px-4 pb-6 pt-2 bg-white/60 backdrop-blur-xl rounded-2xl border-t border-purple-50">
                    <div className="flex items-end gap-2">
                        <div className="flex gap-1 pb-2">
                            <button className="w-10 h-10 flex items-center justify-center text-bluvi-purple/40 hover:text-bluvi-purple hover:bg-purple-50 rounded-full transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20" aria-label="Adjuntar imagen">
                                <Image size={20} strokeWidth={1.8} />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowPicker((o) => !o)}
                                    aria-controls={typingPickerId}
                                    aria-expanded={showPicker}
                                    aria-label="Abrir selector de emoji"
                                    className="w-10 h-10 flex items-center justify-center text-bluvi-purple/40 hover:text-bluvi-purple hover:bg-purple-50 rounded-full transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
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

                        <div className="flex-1 bg-white/90 border border-purple-100 rounded-2xl px-4 py-2.5 shadow-sm flex items-end gap-2">
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
                                className="flex-1 bg-transparent outline-none text-bluvi-purple placeholder:text-bluvi-purple/30 text-[15px] resize-none leading-relaxed max-h-[120px] overflow-y-auto"
                                style={{ minHeight: '24px' }}
                            />
                        </div>

                        <button
                            onClick={() => void handleSendMessage()}
                            aria-label="Enviar mensaje"
                            className={`w-11 h-11 flex items-center justify-center rounded-full shadow-md transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/30 ${inputText.trim() ? 'bg-bluvi-purple text-white shadow-bluvi-purple/30' : 'bg-purple-100 text-bluvi-purple/40'}`}
                            disabled={!inputText.trim() || sending}
                        >
                            <Send size={18} strokeWidth={2} className={inputText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
