import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    createPortal } from 'react-dom';
import { useNavigate,
    useParams } from 'react-router-dom';
import { ShieldSlashIcon,
    TrashIcon,
    FlagIcon,
    ArrowLeftIcon,
    PaperPlaneRightIcon,
    CheckIcon,
    DotsThreeOutlineVerticalIcon,
    ImageIcon,
    SmileyIcon,
    WarningIcon,
    XIcon
} from '@phosphor-icons/react';
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
    sendAudioMessage,
    sendImageMessage,
    deleteMessageForEveryone,
    transcribeAudioMessage,
    type ChatCounterpart,
    type ChatMessage,
} from '../services/chat.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';
import { AudioRecorder } from '../components/AudioRecorder';
import { AudioMessage } from '../components/AudioMessage';
import { DropdownMenu, DropdownMenuButton, DropdownMenuSeparator } from '../components/DropdownMenu';
import { VerifiedIdentityIcon } from '../components/VerifiedIdentityIcon';
import { Tooltip, TooltipTrigger, Button as AriaButton } from '../components/Tooltip';
import { useNotifications } from '../context/NotificationContext';
import { getMyProfile } from '../services/user.service';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RealtimeChatPayload {
    fromUserId: number;
    chatUserId?: number;
    isTyping?: boolean;
    message?: ChatMessage;
    messageId?: number;
    deletedAt?: string;
    lastReadMessageId?: number;
    lastDeliveredMessageId?: number;
    byUserId?: number;
}

type ConversationResponsePartial = {
    counterpart?: ChatCounterpart;
    messages?: ChatMessage[];
    hasMore?: boolean;
    isBlockedByMe?: boolean;
    isBlockedByOther?: boolean;
};

const PAGE_SIZE = 30;
const TYPING_STOP_DELAY = 1200;
const typingPickerId = 'chat-emoji-picker';
const chatHistoryInstructionsId = 'chat-history-keyboard-instructions';
const deleteMessageTitleId = 'delete-message-dialog-title';
const deleteMessageDescriptionId = 'delete-message-dialog-description';
const maxChatMessageLength = 1000;

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
    const [isOptionsClosing, setIsOptionsClosing] = useState(false);
    const [isBlockedByMe, setIsBlockedByMe] = useState(false);
    const [isBlockedByOther, setIsBlockedByOther] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<ChatMessage | null>(null);
    const [messageToReport, setMessageToReport] = useState<ChatMessage | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const [isDeletingMessage, setIsDeletingMessage] = useState(false);
    const [deleteMessageError, setDeleteMessageError] = useState('');
    const [showDeleteConversationModal, setShowDeleteConversationModal] = useState(false);
    const [isDeletingConversation, setIsDeletingConversation] = useState(false);
    const [deleteConversationError, setDeleteConversationError] = useState('');
    const [isRecordingAudio, setIsRecordingAudio] = useState(false);
    const [hasRecordedAudio, setHasRecordedAudio] = useState(false);
    const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
    const [transcribingMessageIds, setTranscribingMessageIds] = useState<Set<number>>(new Set());
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
    const [isHistoryFocused, setIsHistoryFocused] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const typingStopTimerRef = useRef<number | null>(null);
    const isPrependingRef = useRef(false);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const optionsButtonRef = useRef<HTMLButtonElement>(null);
    const optionsCloseTimerRef = useRef<number | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const deleteMessageDialogRef = useRef<HTMLDivElement>(null);
    const deleteMessageCancelButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const currentUserRaw = localStorage.getItem('user');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) as { id?: number; is_face_verified?: boolean } : null;
    const currentUserId = Number(currentUser?.id);
    const [isCurrentUserFaceVerified, setIsCurrentUserFaceVerified] = useState(Boolean(currentUser?.is_face_verified));
    const { refreshNotifications } = useNotifications();
    const reduceMotion = useReducedMotion();
    const prevIsRecordingRef = useRef(isRecordingAudio);
    const isCounterpartLowEnergy = counterpart?.atmosphere === 'bajo';
    const isCounterpartQuiet = counterpart?.atmosphere === 'tranquilo';

    const getMessageElementId = useCallback((messageId: number) => `chat-message-${messageId}`, []);

    const setActiveMessage = useCallback((messageId: number) => {
        setActiveMessageId(messageId);
        window.requestAnimationFrame(() => {
            document.getElementById(getMessageElementId(messageId))?.scrollIntoView({
                block: 'nearest',
                behavior: reduceMotion ? 'auto' : 'smooth',
            });
        });
    }, [getMessageElementId, reduceMotion]);

    useEffect(() => {
        if (prevIsRecordingRef.current && !isRecordingAudio) {
            setHasRecordedAudio(true);
        }
        prevIsRecordingRef.current = isRecordingAudio;
    }, [isRecordingAudio]);

    useEffect(() => {
        if (messages.length === 0) {
            setActiveMessageId(null);
            return;
        }

        if (activeMessageId && messages.some((message) => message.id_message === activeMessageId)) {
            return;
        }

        setActiveMessageId(messages[messages.length - 1].id_message);
    }, [activeMessageId, messages]);

    useEffect(() => {
        if (!lightboxImageUrl) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setLightboxImageUrl(null);
            }

            if ((event.ctrlKey || event.metaKey) && ['s', 'S', 'p', 'P'].includes(event.key)) {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxImageUrl]);

    useEffect(() => {
        if (!messageToDelete) {
            return;
        }

        deleteMessageCancelButtonRef.current?.focus();
    }, [messageToDelete]);

    useEffect(() => {
        let cancelled = false;

        getMyProfile()
            .then((profile) => {
                if (!cancelled) {
                    setIsCurrentUserFaceVerified(Boolean(profile.is_face_verified));
                }
            })
            .catch((error) => {
                console.error('Error comprobando verificación facial para adjuntar imágenes:', error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const sendTypingState = useCallback((isTyping: boolean) => {
        const socket = connectRealtime();
        socket?.emit(isTyping ? 'chat:typing' : 'chat:typing:stop', {
            toUserId: chatUserId,
            chatUserId,
            isTyping,
        });
    }, [chatUserId]);

    const scheduleStopTyping = useCallback(() => {
        if (typingStopTimerRef.current) {
            window.clearTimeout(typingStopTimerRef.current);
        }

        typingStopTimerRef.current = window.setTimeout(() => {
            sendTypingState(false);
        }, TYPING_STOP_DELAY);
    }, [sendTypingState]);

    const handleEmojiClick = (emojiData: EmojiClickData): void => {
        setInputText((prev) => prev + emojiData.emoji);
        setShowPicker(false);
        inputRef.current?.focus();
        sendTypingState(true);
        scheduleStopTyping();
    };

    const loadInitialConversation = useCallback(async () => {
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
            const resp = response as ConversationResponsePartial;
            setIsBlockedByMe(Boolean(resp.isBlockedByMe));
            setIsBlockedByOther(Boolean(resp.isBlockedByOther));
            
            const onlineStatus = await checkUserOnline(chatUserId);
            setIsRemoteUserOnline(onlineStatus.isOnline);
            setCanShowOnlineStatus(onlineStatus.canShowOnlineStatus);
            
            await markConversationRead(chatUserId);
            await refreshNotifications();
        } catch (error) {
            console.error('Error cargando conversación:', error);
        } finally {
            setLoading(false);
        }
    }, [chatUserId, refreshNotifications]);

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

    const handleSendAudio = async (audioBlob: Blob, duration: number) => {
        if (sending || !Number.isInteger(chatUserId) || chatUserId <= 0) {
            return;
        }

        try {
            setSending(true);
            const sent = await sendAudioMessage(chatUserId, audioBlob, duration);
            setMessages((prev) => [...prev, { ...sent, is_read: false, is_delivered: false }]);
        } catch (error) {
            console.error('Error enviando audio:', error);
        } finally {
            setSending(false);
            setHasRecordedAudio(false);
        }
    };

    const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file || sending || !Number.isInteger(chatUserId) || chatUserId <= 0) {
            return;
        }

        if (!isCurrentUserFaceVerified) {
            return;
        }

        try {
            setSending(true);
            const sent = await sendImageMessage(chatUserId, file);
            setMessages((prev) => [...prev, { ...sent, is_read: false, is_delivered: false }]);
        } catch (error) {
            console.error('Error enviando imagen:', error);
            alert(error instanceof Error ? error.message : 'No se pudo enviar la imagen. Inténtalo de nuevo.');
        } finally {
            setSending(false);
        }
    };

    const handleTranscribeAudio = async (message: ChatMessage) => {
        if (!message.audio_url || transcribingMessageIds.has(message.id_message)) {
            return;
        }

        try {
            setTranscribingMessageIds((prev) => {
                const next = new Set(prev);
                next.add(message.id_message);
                return next;
            });

            const result = await transcribeAudioMessage(message.id_message, message.audio_url);
            const transcript = result.updatedMessage?.transcript || result.text;

            setMessages((prev) => prev.map((item) => (
                item.id_message === message.id_message
                    ? { ...item, transcript }
                    : item
            )));
        } catch (error) {
            const apiMessage = error && typeof error === 'object' && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : null;

            console.error('Error transcribiendo audio:', apiMessage || error);

            setMessages((prev) => prev.map((item) => (
                item.id_message === message.id_message
                    ? { ...item, transcript: 'No es posible transcribir' }
                    : item
            )));
        } finally {
            setTranscribingMessageIds((prev) => {
                const next = new Set(prev);
                next.delete(message.id_message);
                return next;
            });
        }
    };

    const openDeleteMessageModal = (message: ChatMessage) => {
        if (message.sender_id !== currentUserId || message.deleted_at) {
            return;
        }

        previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setDeleteMessageError('');
        setMessageToDelete(message);
    };

    const closeDeleteMessageModal = () => {
        if (isDeletingMessage) {
            return;
        }

        setMessageToDelete(null);
        setDeleteMessageError('');
        window.requestAnimationFrame(() => {
            previousFocusRef.current?.focus();
            previousFocusRef.current = null;
        });
    };

    const confirmDeleteMessageForEveryone = async () => {
        if (!messageToDelete) {
            return;
        }

        try {
            setIsDeletingMessage(true);
            setDeleteMessageError('');
            const deletedMessage = await deleteMessageForEveryone(messageToDelete.id_message);
            setMessages((prev) => prev.map((item) => (
                item.id_message === messageToDelete.id_message
                    ? { ...item, ...deletedMessage, is_read: item.is_read, is_delivered: item.is_delivered }
                    : item
            )));
            setMessageToDelete(null);
            window.requestAnimationFrame(() => {
                previousFocusRef.current?.focus();
                previousFocusRef.current = null;
            });
        } catch (error) {
            console.error('Error eliminando mensaje:', error);
            setDeleteMessageError('No se pudo eliminar el mensaje. Inténtalo de nuevo.');
        } finally {
            setIsDeletingMessage(false);
        }
    };

    const handleDeleteMessageDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDeleteMessageModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusable = Array.from(
            deleteMessageDialogRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) || []
        );

        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
        }

        if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const closeOptionsMenu = useCallback((returnFocus = true) => {
        if (!showOptions || isOptionsClosing) {
            return;
        }

        setIsOptionsClosing(true);

        if (optionsCloseTimerRef.current) {
            window.clearTimeout(optionsCloseTimerRef.current);
        }

        optionsCloseTimerRef.current = window.setTimeout(() => {
            setShowOptions(false);
            setIsOptionsClosing(false);
            optionsCloseTimerRef.current = null;

            if (returnFocus) {
                optionsButtonRef.current?.focus();
            }
        }, 170);
    }, [isOptionsClosing, showOptions]);

    const openOptionsMenu = () => {
        if (optionsCloseTimerRef.current) {
            window.clearTimeout(optionsCloseTimerRef.current);
            optionsCloseTimerRef.current = null;
        }

        setIsOptionsClosing(false);
        setShowOptions(true);
    };

    const handleEnterSend = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void handleSendMessage();
        }
    };

    const handleMessagesKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget) {
            return;
        }

        if (messages.length === 0) {
            return;
        }

        const currentIndex = Math.max(
            0,
            activeMessageId ? messages.findIndex((message) => message.id_message === activeMessageId) : messages.length - 1
        );
        const activeMessage = messages[currentIndex] || messages[messages.length - 1];

        if (event.key === 'ArrowDown' || event.key === 'ArrowRightIcon') {
            event.preventDefault();
            const next = messages[Math.min(currentIndex + 1, messages.length - 1)];
            setActiveMessage(next.id_message);
            return;
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeftIcon') {
            event.preventDefault();
            const previous = messages[Math.max(currentIndex - 1, 0)];
            setActiveMessage(previous.id_message);
            return;
        }

        if (event.key === 'Home') {
            event.preventDefault();
            setActiveMessage(messages[0].id_message);
            return;
        }

        if (event.key === 'End') {
            event.preventDefault();
            setActiveMessage(messages[messages.length - 1].id_message);
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            inputRef.current?.focus();
            return;
        }

        if ((event.key === 'Enter' || event.key === ' ') && activeMessage?.message_type === 'image' && activeMessage.image_url && !activeMessage.deleted_at) {
            event.preventDefault();
            setLightboxImageUrl(activeMessage.image_url);
            return;
        }

        if ((event.key === 'Delete' || event.key === 'Backspace') && activeMessage?.sender_id === currentUserId && !activeMessage.deleted_at) {
            event.preventDefault();
            openDeleteMessageModal(activeMessage);
        }
    };

    const handleDeleteConversation = () => {
        setDeleteConversationError('');
        setShowDeleteConversationModal(true);
    };

    const handleBlockUser = () => {
        setShowOptions(false);
        setShowBlockModal(true);
    };

    const confirmDeleteConversation = async () => {
        setIsDeletingConversation(true);
        setDeleteConversationError('');

        try {
            await deleteConversation(chatUserId, false);
            setShowDeleteConversationModal(false);
            navigate('/app/messages');
        } catch (error) {
            console.error('Error borrando conversación:', error);
            setDeleteConversationError('No se pudo borrar la conversación. Inténtalo de nuevo.');
        } finally {
            setIsDeletingConversation(false);
        }
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
        setMessageToReport(null);
        setShowReportModal(true);
    };

    const handleReportMessage = (message: ChatMessage) => {
        if (message.sender_id === currentUserId || message.deleted_at) {
            return;
        }

        setMessageToReport(message);
        setReportReason('');
        setReportSuccess(false);
        setShowReportModal(true);
    };

    const confirmReport = async () => {
        if (!reportReason.trim()) return;
        
        setIsReporting(true);
        try {
            await reportUser(chatUserId, reportReason, messageToReport?.id_message);
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
    }, [loadInitialConversation]);

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

        const onRead = (payload: RealtimeChatPayload) => {
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

        const onDelivered = (payload: RealtimeChatPayload) => {
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

        const onDeleted = (payload: RealtimeChatPayload) => {
            if (payload.fromUserId !== chatUserId && payload.message?.sender_id !== chatUserId) {
                return;
            }

            const deletedMessageId = payload.message?.id_message || payload.messageId;
            if (!deletedMessageId) {
                return;
            }

            setMessages((prev) => prev.map((message) => (
                message.id_message === deletedMessageId
                    ? {
                        ...message,
                        ...payload.message,
                        deleted_at: payload.message?.deleted_at || payload.deletedAt || new Date().toISOString(),
                        content: '',
                        audio_url: undefined,
                        image_url: undefined,
                        transcript: null,
                        duration_seconds: undefined,
                    }
                    : message
            )));
        };

        socket?.on('chat:typing', onTyping);
        socket?.on('chat:message:new', onMessage);
        socket?.on('chat:messages:read', onRead);
        socket?.on('chat:messages:delivered', onDelivered);
        socket?.on('chat:message:deleted', onDeleted);

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
            socket?.off('chat:message:deleted', onDeleted);
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
    }, [messages, isTypingRemote, loading, reduceMotion]);

    useEffect(() => {
        const handlePointerDownOutside = (e: PointerEvent) => {
            const target = e.target as Node;

            if (
                optionsMenuRef.current && !optionsMenuRef.current.contains(target) &&
                optionsButtonRef.current && !optionsButtonRef.current.contains(target)
            ) {
                closeOptionsMenu();
            }
        };
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showOptions) {
                closeOptionsMenu();
            }
            
            if (e.key === 'Tab' && showOptions && optionsMenuRef.current) {
                const buttons = Array.from(optionsMenuRef.current.querySelectorAll('button')) as HTMLButtonElement[];
                if (buttons.length === 0) return;
                
                const activeElement = document.activeElement;
                const firstButton = buttons[0];
                const lastButton = buttons[buttons.length - 1];
                
                if (e.shiftKey) {
                    
                    if (activeElement === firstButton) {
                        e.preventDefault();
                        lastButton.focus();
                    }
                } else {
                    
                    if (activeElement === lastButton) {
                        e.preventDefault();
                        firstButton.focus();
                    }
                }
            }
        };
        
        if (showOptions) {
            document.addEventListener('pointerdown', handlePointerDownOutside, true);
            document.addEventListener('keydown', handleKeyDown);
            
            setTimeout(() => {
                const firstButton = optionsMenuRef.current?.querySelector('button');
                (firstButton as HTMLButtonElement)?.focus();
            }, 0);
        }
        
        return () => {
            document.removeEventListener('pointerdown', handlePointerDownOutside, true);
            document.removeEventListener('keydown', handleKeyDown);
            if (typingStopTimerRef.current) {
                window.clearTimeout(typingStopTimerRef.current);
            }
            sendTypingState(false);
        };
    }, [showOptions, closeOptionsMenu, sendTypingState]);

    useEffect(() => {
        return () => {
            if (optionsCloseTimerRef.current) {
                window.clearTimeout(optionsCloseTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!showPicker) return;

        const handlePointerDownOutside = (event: PointerEvent) => {
            const target = event.target as Node;

            if (
                emojiPickerRef.current?.contains(target) ||
                emojiButtonRef.current?.contains(target)
            ) {
                return;
            }

            setShowPicker(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowPicker(false);
                emojiButtonRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDownOutside, true);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDownOutside, true);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showPicker]);

    if (!Number.isInteger(chatUserId) || chatUserId <= 0) {
        return <div className="pt-20 text-center text-app-primary font-medium">Chat no válido.</div>;
    }

    if (loading) {
        return <div className="pt-20 text-center text-app-primary font-medium">Cargando conversación...</div>;
    }

    return (
        <div className="flex h-full min-h-0 overflow-hidden overscroll-none">
            <div className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden bg-app-surface/45">
                <header className="flex-none z-50 bg-app-surface-soft border-b-2 border-app-soft px-4 md:px-5 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Volver a la lista de conversaciones"
                            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-app-surface-soft text-app-accent transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/50 focus-visible:ring-offset-2 focus-visible:shadow-lg"
                        >
                            <ArrowLeftIcon size={22} weight="bold" />
                        </button>

                        <TooltipTrigger delay={250}>
                            <AriaButton
                                onPress={() => navigate(`/app/user/${chatUserId}`)}
                                aria-label={`Ver perfil de ${counterpart ? `${counterpart.first_name} ${counterpart.last_name}` : 'esta persona'}`}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/70 focus-visible:ring-offset-2 focus-visible:shadow-lg rounded-2xl px-1 py-1 text-left"
                            >
                            <div className="relative">
                                <img
                                    src={(isBlockedByMe || isBlockedByOther) ? 'https://via.placeholder.com/120?text=?' : (counterpart?.main_photo || 'https://via.placeholder.com/120')}
                                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-app-soft shadow-sm"
                                    alt={counterpart?.first_name || 'Usuario'}
                                />
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-app-surface transition-colors ${canShowOnlineStatus && isRemoteUserOnline && !isBlockedByMe && !isBlockedByOther ? 'bg-green-400' : 'bg-gray-400'}`} />
                            </div>
                            <div className="min-w-0 text-left">
                                <div className="flex items-center gap-1.5">
                                    <h2 className="truncate text-[15px] font-semibold text-app-primary leading-tight">
                                        {(isBlockedByMe || isBlockedByOther) ? 'Usuario' : (counterpart ? `${counterpart.first_name} ${counterpart.last_name}` : 'Chat')}
                                    </h2>
                                    {!isBlockedByMe && !isBlockedByOther && counterpart?.is_face_verified && (
                                        <VerifiedIdentityIcon
                                            variant="static"
                                            className="flex-shrink-0"
                                            iconClassName="h-4.5 w-4.5"
                                        />
                                    )}
                                </div>
                                <span className="text-[11px] font-medium" aria-live="polite" role="status">
                                    {isTypingRemote && !isCounterpartLowEnergy && !isBlockedByMe && !isBlockedByOther ? (
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
                            </AriaButton>

                            <Tooltip placement="bottom">Ver perfil</Tooltip>
                        </TooltipTrigger>
                    </div>

                    <div className="relative">
                        <button
                            ref={optionsButtonRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (showOptions) {
                                    closeOptionsMenu();
                                } else {
                                    openOptionsMenu();
                                }
                            }}
                            className="inline-flex h-10 items-center justify-center gap-1 rounded-full px-2.5 text-sm font-bold text-app-muted hover:text-app-primary transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/70 focus-visible:ring-offset-2 focus-visible:shadow-lg"
                            aria-label="Más opciones del chat"
                            aria-expanded={showOptions}
                            aria-haspopup="menu"
                        >
                            <span>Más</span>
                            <DotsThreeOutlineVerticalIcon size={24} aria-hidden="true" />
                            
                        </button>

                        {showOptions && (
                            <DropdownMenu
                                ref={optionsMenuRef}
                                label="Menú de chat"
                                isOpen={showOptions}
                                isClosing={isOptionsClosing}
                                className="bg-app-surface-strong"
                            >
                                <DropdownMenuButton onClick={() => { closeOptionsMenu(false); void handleReportUser(); }}>
                                    <div className="flex items-center gap-3">
                                        <FlagIcon size={16} weight="bold" className="text-app-muted flex-shrink-0" />
                                        <span>Denunciar usuario</span>
                                    </div>
                                </DropdownMenuButton>
                                {!isBlockedByMe && (
                                    <DropdownMenuButton onClick={() => { closeOptionsMenu(false); void handleBlockUser(); }}>
                                        <div className="flex items-center gap-3">
                                            <ShieldSlashIcon size={16} weight="bold" className="text-app-muted flex-shrink-0" />
                                            <span>Bloquear usuario</span>
                                        </div>
                                    </DropdownMenuButton>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuButton onClick={() => { closeOptionsMenu(false); void handleDeleteConversation(); }} danger>
                                    <div className="flex items-center gap-3">
                                        <TrashIcon size={16} weight="bold" className="flex-shrink-0" />
                                        <span>Borrar conversación</span>
                                    </div>
                                </DropdownMenuButton>
                            </DropdownMenu>
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
                    aria-describedby={chatHistoryInstructionsId}
                    onScroll={(event) => {
                        const element = event.currentTarget;
                        if (element.scrollTop < 120 && hasMore && !loadingOlder) {
                            void loadOlderMessages();
                        }
                    }}
                    onFocus={(event) => {
                        setIsHistoryFocused(true);
                        if (event.target === event.currentTarget && messages.length > 0) {
                            setActiveMessage(activeMessageId || messages[messages.length - 1].id_message);
                        }
                    }}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            setIsHistoryFocused(false);
                        }
                    }}
                    onKeyDown={handleMessagesKeyDown}
                    className="flex-1 min-h-0 overscroll-contain overflow-y-auto px-2.5 py-4 space-y-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/15 scrollbar-hide sm:px-4 sm:py-6 sm:space-y-2 md:px-6"
                    tabIndex={0}
                >
                    <p id={chatHistoryInstructionsId} className="sr-only">
                        Historial de mensajes. Usa las flechas arriba y abajo para recorrer mensajes, Enter para abrir una imagen, Suprimir para eliminar un mensaje enviado por ti, y Escape para volver al campo de texto.
                    </p>
                    {isHistoryFocused && (
                        <div
                            className="sticky top-2 z-10 mx-auto mb-3 w-fit max-w-[calc(100%-1rem)] rounded-full border border-app-soft bg-app-surface-strong/95 px-4 py-2 text-center text-xs font-semibold text-app-secondary shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200"
                            role="status"
                            aria-live="polite"
                        >
                            Usa ↑ ↓ para recorrer mensajes. Enter abre imagen. Esc vuelve al campo.
                        </div>
                    )}
                    {loadingOlder && (
                        <div className="text-center text-xs text-app-muted py-2" aria-live="polite">Cargando mensajes anteriores...</div>
                    )}

                    <div className="flex items-center gap-3 my-4" aria-hidden="true">
                        <div className="flex-1 h-px border-t border-app-soft" />
                        <span className="text-[11px] text-app-muted font-medium tracking-wide uppercase">Hoy</span>
                        <div className="flex-1 h-px border-t border-app-soft" />
                    </div>

                    {(isCounterpartLowEnergy || isCounterpartQuiet) && counterpart && !isBlockedByMe && !isBlockedByOther && (
                        <div
                            className="sticky top-0.5 z-20 mx-auto mb-1 w-full max-w-lg rounded-xl border border-sky-100 bg-sky-50/95 px-2.5 py-1.5 text-center text-[12px] leading-4 text-slate-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-app-surface-strong dark:text-app-primary dark:shadow-black/20 sm:px-3 sm:py-2 sm:text-[13px]"
                            role="status"
                            aria-live="polite"
                        >
                            {isCounterpartLowEnergy
                                ? `${counterpart.first_name} tiene la energía social baja justo ahora. Puede tardar más en responder, pero sigue teniendo interes en hablar contigo!`
                                : `${counterpart.first_name} está en modo tranquilo justo ahora. Quizá prefiera una conversación más pausada y sin presión.`}
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const prevMsg = messages[index - 1];
                        const isSameSender = prevMsg?.sender_id === msg.sender_id;
                        const isRead = Boolean(msg.is_read);
                        const isDeleted = Boolean(msg.deleted_at);
                        const isActive = activeMessageId === msg.id_message;
                        const isKeyboardActive = isActive && isHistoryFocused;
                        const senderLabel = isMe ? 'Tu mensaje' : `Mensaje de ${counterpart?.first_name || 'la otra persona'}`;
                        const contentLabel = isDeleted
                            ? 'eliminado'
                            : msg.message_type === 'audio'
                                ? 'nota de audio'
                                : msg.message_type === 'image'
                                    ? 'imagen'
                                    : msg.content;

                        return (
                            <div
                                key={msg.id_message}
                                id={getMessageElementId(msg.id_message)}
                                role="article"
                                aria-current={isKeyboardActive ? 'true' : undefined}
                                aria-label={`${senderLabel}, ${contentLabel}, ${formatHour(msg.created_at)}`}
                                onMouseDown={() => setActiveMessageId(msg.id_message)}
                                className={`group/message flex items-end gap-1.5 rounded-3xl transition-shadow duration-200 sm:gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mt-1' : 'mt-2.5 sm:mt-3'} ${isKeyboardActive ? 'ring-2 ring-app-accent/25 ring-offset-2 ring-offset-transparent' : ''}`}
                            >
                                {!isMe && (
                                    <div className="w-6 flex-none self-end sm:w-7">
                                        {(!messages[index + 1] || messages[index + 1].sender_id === currentUserId) && (
                                            <img
                                                src={counterpart?.main_photo || 'https://via.placeholder.com/120'}
                                                className="h-6 w-6 rounded-full object-cover ring-1 ring-app-soft sm:h-7 sm:w-7"
                                                alt={counterpart?.first_name || 'Usuario'}
                                            />
                                        )}
                                    </div>
                                )}

                                {isMe && !isDeleted && (
                                    <TooltipTrigger delay={300}>
                                        <AriaButton
                                            onPress={() => openDeleteMessageModal(msg)}
                                            excludeFromTabOrder={!isKeyboardActive}
                                            className={`mb-6 hidden h-8 w-8 scale-90 items-center justify-center rounded-full border border-app-soft bg-app-surface text-app-muted opacity-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/15 group-hover/message:scale-100 group-hover/message:opacity-100 sm:inline-flex ${isKeyboardActive ? 'scale-100 opacity-100' : ''}`}
                                            aria-label="Eliminar mensaje para todos"
                                        >
                                            <TrashIcon size={14} weight="bold" />
                                        </AriaButton>
                                        <Tooltip>Eliminar para todos</Tooltip>
                                    </TooltipTrigger>
                                )}

                                {!isMe && !isDeleted && (
                                    <TooltipTrigger delay={300}>
                                        <AriaButton
                                            onPress={() => handleReportMessage(msg)}
                                            excludeFromTabOrder={!isKeyboardActive}
                                            className={`mb-6 hidden h-8 w-8 scale-90 items-center justify-center rounded-full border border-app-soft bg-app-surface text-app-muted opacity-0 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 hover:shadow-md focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/15 group-hover/message:scale-100 group-hover/message:opacity-100 sm:inline-flex ${isKeyboardActive ? 'scale-100 opacity-100' : ''}`}
                                            aria-label="Reportar mensaje"
                                        >
                                            <FlagIcon size={14} weight="bold" />
                                        </AriaButton>
                                        <Tooltip>Reportar mensaje</Tooltip>
                                    </TooltipTrigger>
                                )}

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${msg.message_type === 'audio' && !isDeleted ? (isMe ? 'max-w-[86%] sm:max-w-[24rem]' : 'w-full max-w-[calc(100%-2rem)] sm:max-w-[24rem]') : 'max-w-[82%] sm:max-w-[75%]'}`}>
                                    {isDeleted ? (
                                        <div
                                            className={`
                                                border-2 border-app-strong bg-app-surface/80 px-4 py-2.5 text-[14px] italic leading-6 text-app-muted shadow-sm
                                            ${isMe
                                                    ? 'rounded-[22px] rounded-br-md'
                                                    : 'rounded-[22px] rounded-bl-md'
                                            }
                                        `}
                                        >
                                            Mensaje eliminado
                                        </div>
                                    ) : msg.message_type === 'audio' && msg.audio_url ? (
                                        <div className="mb-1">
                                            <AudioMessage
                                                audioUrl={msg.audio_url}
                                                duration={msg.duration_seconds || 0}
                                                isOwn={isMe}
                                                transcript={msg.transcript}
                                                isTranscribing={transcribingMessageIds.has(msg.id_message)}
                                                onTranscribe={!msg.transcript ? () => void handleTranscribeAudio(msg) : undefined}
                                                isInteractive={isKeyboardActive}
                                            />
                                        </div>
                                    ) : msg.message_type === 'image' && msg.image_url ? (
                                        <button
                                            type="button"
                                            onClick={() => setLightboxImageUrl(msg.image_url || null)}
                                            onContextMenu={(event) => event.preventDefault()}
                                            onAuxClick={(event) => event.preventDefault()}
                                            onDragStart={(event) => event.preventDefault()}
                                            tabIndex={isKeyboardActive ? 0 : -1}
                                            className={`group/image relative block select-none overflow-hidden rounded-[22px] shadow-sm border transition-all hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/20 ${
                                                isMe
                                                    ? 'rounded-br-md border-app-accent/20'
                                                    : 'rounded-bl-md border-2 border-app-strong bg-app-surface'
                                            }`}
                                            aria-label="Ver imagen en grande"
                                        >
                                            <img
                                                src={msg.image_url}
                                                alt="Imagen enviada en el chat"
                                                className="max-h-72 w-full max-w-xs select-none object-cover transition-transform duration-500 group-hover/image:scale-[1.03]"
                                                loading="lazy"
                                                draggable={false}
                                                onContextMenu={(event) => event.preventDefault()}
                                                onDragStart={(event) => event.preventDefault()}
                                            />
                                            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover/image:bg-black/10" />
                                            <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
                                                Bluvi
                                            </span>
                                        </button>
                                    ) : (
                                        <div
                                            className={`
                                                px-3.5 py-2.5 text-[15px] leading-7 shadow-sm sm:px-4
                                            ${isMe
                                                    ? 'text-app-on-accent rounded-[22px] rounded-br-md shadow-md'
                                                    : 'bg-app-surface text-app-primary rounded-[22px] rounded-bl-md border-2 border-app-strong'
                                            }
                                        `}
                                            style={{
                                                overflowWrap: 'anywhere',
                                                ...(isMe ? { backgroundColor: 'var(--app-own-message-bg)' } : {}),
                                            }}
                                        >
                                            {msg.content}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[10.5px] text-app-muted mr-1 font-medium">{formatHour(msg.created_at)}</span>
                                        {isMe && (
                                            isRead ? (
                                                <span className="flex" role="img" aria-label="Leído">
                                                    <CheckIcon size={13} weight="bold" style={{ color: 'var(--app-message-read-check)' }} aria-hidden="true" />
                                                    <CheckIcon size={13} weight="bold" style={{ color: 'var(--app-message-read-check)', marginLeft: '-8px' }} aria-hidden="true" />
                                                </span>
                                            ) : msg.is_delivered ? (
                                                <span className="flex" role="img" aria-label="Entregado">
                                                    <CheckIcon size={13} weight="bold" className="text-app-muted" aria-hidden="true" />
                                                    <CheckIcon size={13} weight="bold" className="text-app-muted" style={{ marginLeft: '-8px' }} aria-hidden="true" />
                                                </span>
                                            ) : (
                                                <span className="flex" role="img" aria-label="Enviado">
                                                    <CheckIcon size={13} weight="bold" className="text-app-muted" aria-hidden="true" />
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTypingRemote && !isCounterpartLowEnergy && (
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

                <div className="flex-none bg-app-surface-soft border-t-2 border-app-soft px-2 pb-3 pt-2.5 sm:px-3 sm:pb-4 sm:pt-3 md:px-4">
                    {(isBlockedByMe || isBlockedByOther) ? (
                        <div className="flex items-center justify-center py-4 px-6 bg-app-surface rounded-2xl border border-app-soft border-dashed">
                            <p className="text-sm text-app-muted font-medium italic">
                            {isBlockedByMe ? 'Has bloqueado a este usuario. Desbloquéalo para enviar mensajes.' : 'Ya no puedes enviar mensajes a este usuario.'}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-end gap-1.5 rounded-[22px] bg-app-surface-strong border-2 border-app-soft px-2 py-1.5 shadow-md sm:gap-2 sm:rounded-[24px] sm:px-2.5 sm:py-2">
                            {!isRecordingAudio && (
                                <div className="flex gap-0.5 pb-1 sm:gap-1">
                                    {isCurrentUserFaceVerified ? (
                                        <TooltipTrigger delay={300}>
                                            <AriaButton
                                                onPress={() => imageInputRef.current?.click()}
                                                isDisabled={sending}
                                                className="flex h-9 w-9 items-center justify-center rounded-2xl text-app-muted transition-all hover:bg-app-surface-soft hover:text-app-primary active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/70 focus-visible:ring-offset-2 focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-10"
                                                aria-label="Adjuntar imagen"
                                            >
                                                <ImageIcon size={20} weight="bold" />
                                            </AriaButton>
                                            <Tooltip>Adjuntar imagen</Tooltip>
                                        </TooltipTrigger>
                                    ) : (
                                        <TooltipTrigger delay={300}>
                                            <AriaButton
                                                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-2xl text-app-muted/60 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/40 focus-visible:ring-offset-2 sm:h-10 sm:w-10"
                                                aria-label="Solo pueden enviar fotos los perfiles verificados"
                                            >
                                                <ImageIcon size={20} weight="bold" />
                                            </AriaButton>
                                            <Tooltip>Solo pueden enviar fotos los perfiles verificados</Tooltip>
                                        </TooltipTrigger>
                                    )}
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        aria-label="Adjuntar imagen al chat"
                                        className="sr-only"
                                        onChange={(event) => void handleImageSelected(event)}
                                    />
                                    <div className="relative">
                                        <TooltipTrigger delay={300}>
                                            <AriaButton
                                                ref={emojiButtonRef}
                                                onPress={() => setShowPicker((o) => !o)}
                                                aria-controls={typingPickerId}
                                                aria-expanded={showPicker}
                                                aria-label="Abrir selector de emoji"
                                                className="flex h-9 w-9 items-center justify-center rounded-2xl text-app-muted transition-all hover:bg-app-surface-soft hover:text-app-primary active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/70 focus-visible:ring-offset-2 focus-visible:shadow-lg sm:h-10 sm:w-10"
                                            >
                                                <SmileyIcon size={20} weight="bold" />
                                            </AriaButton>
                                            <Tooltip>Abrir emojis</Tooltip>
                                        </TooltipTrigger>

                                        {showPicker && (
                                            <div ref={emojiPickerRef} id={typingPickerId} className="absolute bottom-12 left-0 z-50">
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiClick}
                                                    theme={Theme.LIGHT}
                                                    lazyLoadEmojis={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isRecordingAudio && !hasRecordedAudio && (
                                <div className="flex-1 bg-transparent px-1.5 py-1.5 flex items-end gap-2 sm:px-2 sm:py-2">
                                    <textarea
                                        rows={1}
                                        placeholder="Escribe un mensaje..."
                                        aria-label="Escribe un mensaje"
                                        maxLength={maxChatMessageLength}
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
                            )}

                            {!hasRecordedAudio && inputText.trim() ? (
                                <button
                                    onClick={() => void handleSendMessage()}
                                    aria-label="Enviar mensaje"
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl text-app-on-accent shadow-md transition-all hover:scale-105 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/70 focus-visible:ring-offset-2 focus-visible:shadow-xl sm:h-11 sm:w-11"
                                    style={{ backgroundColor: 'var(--app-accent)' }}
                                    disabled={sending}
                                >
                                    <PaperPlaneRightIcon size={18} weight="bold" className="translate-x-0.5 -translate-y-0.5" />
                                </button>
                            ) : (
                                <AudioRecorder
                                    onSendAudio={handleSendAudio}
                                    disabled={sending}
                                    onRecordingStateChange={setIsRecordingAudio}
                                    onRecordingCancelled={() => setHasRecordedAudio(false)}
                                    fullWidth={isRecordingAudio || hasRecordedAudio}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            {lightboxImageUrl && createPortal(
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
                    onClick={() => setLightboxImageUrl(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Imagen del chat en pantalla completa"
                >
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-20">
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Visualizando</span>
                            <span className="font-bold">Imagen del chat</span>
                        </div>
                        <button
                            onClick={() => setLightboxImageUrl(null)}
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                            aria-label="Cerrar imagen"
                        >
                            <XIcon size={24} weight="bold" />
                        </button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        <div
                            className="relative max-w-full max-h-full select-none"
                            onClick={(event) => event.stopPropagation()}
                            onContextMenu={(event) => event.preventDefault()}
                            onAuxClick={(event) => event.preventDefault()}
                            onDragStart={(event) => event.preventDefault()}
                        >
                            <img
                                src={lightboxImageUrl}
                                alt=""
                                className="max-w-full max-h-[calc(100svh-7rem)] select-none object-contain rounded-xl shadow-2xl animate-zoom-in"
                                draggable={false}
                                onContextMenu={(event) => event.preventDefault()}
                                onDragStart={(event) => event.preventDefault()}
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4">
                                <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
                                    Bluvi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {messageToDelete && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={deleteMessageTitleId}
                    aria-describedby={deleteMessageDescriptionId}
                    onKeyDown={handleDeleteMessageDialogKeyDown}
                    ref={deleteMessageDialogRef}
                >
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={closeDeleteMessageModal}
                        aria-hidden="true"
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm border border-red-100">
                                <TrashIcon size={30} weight="bold" />
                            </div>
                            <h3 id={deleteMessageTitleId} className="text-xl font-bold text-app-primary mb-3">¿Eliminar mensaje?</h3>
                            <p id={deleteMessageDescriptionId} className="text-sm text-app-muted leading-relaxed mb-6">
                                Se eliminará del chat para ambos, aunque la otra persona podría haberlo visto antes. No podrás deshacer esta acción.
                            </p>
                            {deleteMessageError && (
                                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {deleteMessageError}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    ref={deleteMessageCancelButtonRef}
                                    onClick={closeDeleteMessageModal}
                                    disabled={isDeletingMessage}
                                    className="px-6 py-3.5 text-sm font-semibold text-app-primary bg-app-surface-soft hover:bg-app-soft rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => void confirmDeleteMessageForEveryone()}
                                    disabled={isDeletingMessage}
                                    className="px-6 py-3.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all active:scale-95 shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isDeletingMessage ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConversationModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => !isDeletingConversation && setShowDeleteConversationModal(false)}
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm border border-red-100">
                                <TrashIcon size={30} weight="bold" />
                            </div>
                            <h3 className="text-xl font-bold text-app-primary mb-3">¿Borrar conversación?</h3>
                            <p className="text-sm text-app-muted leading-relaxed mb-6">
                                Se eliminará esta conversación de tu bandeja. Esta acción no bloqueará a {counterpart?.first_name || 'esta persona'}.
                            </p>
                            {deleteConversationError && (
                                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {deleteConversationError}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowDeleteConversationModal(false)}
                                    disabled={isDeletingConversation}
                                    className="px-6 py-3.5 text-sm font-semibold text-app-primary bg-app-surface-soft hover:bg-app-soft rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => void confirmDeleteConversation()}
                                    disabled={isDeletingConversation}
                                    className="px-6 py-3.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all active:scale-95 shadow-md shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isDeletingConversation ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Borrar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showBlockModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => !isBlocking && setShowBlockModal(false)}
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-sm border border-red-100">
                                <WarningIcon size={32} weight="bold" />
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

            {showReportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => {
                            if (!isReporting) {
                                setShowReportModal(false);
                                setMessageToReport(null);
                            }
                        }}
                    />
                    <div className="relative bg-app-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-app-soft">
                        {reportSuccess ? (
                            <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-100 shadow-sm">
                                    <CheckIcon size={40} weight="bold" />
                                </div>
                                <h3 className="text-2xl font-bold text-app-primary mb-3">¡Reporte enviado!</h3>
                                <p className="text-sm text-app-muted leading-relaxed mb-8">
                                    Gracias por ayudarnos a mantener Bluvi seguro. Revisaremos tu reporte lo antes posible.
                                </p>
                                <button
                                    onClick={() => {
                                        setShowReportModal(false);
                                        setReportSuccess(false);
                                        setMessageToReport(null);
                                    }}
                                    className="w-full py-4 text-sm font-bold text-app-on-accent bg-app-accent hover:opacity-90 rounded-2xl transition-all active:scale-95 shadow-lg shadow-app-accent/20"
                                    style={{ backgroundColor: 'var(--app-accent)' }}
                                >
                                    Entendido
                                </button>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-sm border border-orange-100">
                                    <FlagIcon size={32} weight="bold" />
                                </div>
                                <h3 className="text-xl font-bold text-app-primary mb-3 text-center">
                                    {messageToReport ? 'Denunciar mensaje' : `Denunciar a ${counterpart?.first_name}`}
                                </h3>
                                <p className="text-sm text-app-muted leading-relaxed mb-6 text-center">
                                    {messageToReport
                                        ? 'Revisaremos este mensaje concreto para mantener la comunidad segura.'
                                        : 'Cuéntanos qué ha pasado. Revisaremos tu reporte para mantener la comunidad segura.'}
                                </p>
                                {messageToReport && (
                                    <div className="mb-5 rounded-2xl border border-app-soft bg-app-surface-soft px-4 py-3 text-sm text-app-primary">
                                        <p className="mb-1 text-xs font-black uppercase text-app-muted">Mensaje reportado</p>
                                        <p className="font-medium">
                                            {messageToReport.message_type === 'image'
                                                ? 'Imagen enviada en el chat'
                                                : messageToReport.message_type === 'audio'
                                                    ? 'Nota de audio enviada en el chat'
                                                    : messageToReport.content}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="space-y-4 mb-8">
                                    <textarea
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder="Escribe el motivo de la denuncia..."
                                        className="w-full h-32 px-4 py-3 text-sm bg-app-surface-soft border border-app-soft rounded-2xl focus:ring-2 focus:ring-app-accent/20 focus:border-app-accent outline-none transition-all resize-none"
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
                                            setMessageToReport(null);
                                        }}
                                        disabled={isReporting}
                                        className="px-6 py-3.5 text-sm font-semibold text-app-primary bg-app-surface-soft hover:bg-app-soft rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => void confirmReport()}
                                        disabled={isReporting || !reportReason.trim()}
                                        className="px-6 py-3.5 text-sm font-bold text-app-on-accent bg-app-accent hover:opacity-90 rounded-2xl transition-all active:scale-95 shadow-md shadow-app-accent/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                        style={{ backgroundColor: 'var(--app-accent)' }}
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

