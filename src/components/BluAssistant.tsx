import React, { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { PaperPlaneRightIcon, XIcon } from '@phosphor-icons/react';
import { BluMascot } from './BluMascot';
import { assistantService, type AssistantHistoryMessage } from '../services/assistant.service';

type Message = {
    id: number;
    text: string;
    from: 'blu' | 'user';
};

const SUGGESTIONS = [
    'Quiero conocer gente afín a mí',
    'La app se siente intensa, ayúdame',
    'No sé cómo empezar una charla',
    'Quiero dejar mi perfil más yo',
];

const MAX_MESSAGE_LENGTH = 280;

const PROFANITY_PATTERNS = [
    /\bput[ao]s?\b/giu,
    /\bputisima\b/giu,
    /\bmierd[ao]s?\b/giu,
    /\bjod(?:er|ete|ido|ida|idos|idas)\b/giu,
    /\bco\u00f1[ao]\b/giu,
    /\bcabr[o\u00f3]n(?:es)?\b/giu,
    /\bgilipollas\b/giu,
    /\bimb[e\u00e9]cil(?:es)?\b/giu,
    /\bidiot[ao]s?\b/giu,
    /\best[u\u00fa]pid[ao]s?\b/giu,
    /\bsubnormal(?:es)?\b/giu,
    /\bpayas[ao]s?\b/giu,
    /\bcapull[ao]s?\b/giu,
    /\bmalparid[ao]s?\b/giu,
];

const BluAssistantAnimation: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
    return <BluMascot size={size} />;
};

const toAssistantHistory = (items: Message[]): AssistantHistoryMessage[] =>
    items
        .filter(msg => msg.id !== 0)
        .slice(-8)
        .map(msg => ({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: msg.text,
        }));

const sanitizeProfanity = (text: string) =>
    PROFANITY_PATTERNS.reduce((current, pattern) => current.replace(pattern, '***'), text);

export const BluAssistant: React.FC = () => {
    const panelId = useId();
    const titleId = useId();
    const descriptionId = useId();
    const logId = useId();
    const inputId = useId();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState('');
    const nextMessageId = useRef(1);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 0,
            text: 'Ey, estoy aquí contigo. Podemos ir despacio: me cuentas qué necesitas y lo vemos paso a paso, sin presión.',
            from: 'blu',
        },
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, typing]);

    useEffect(() => {
        if (!open) return;

        const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                window.requestAnimationFrame(() => triggerRef.current?.focus());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const closeAssistant = () => {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const sendMessage = async (text: string) => {
        const cleanText = text.trim().slice(0, MAX_MESSAGE_LENGTH);
        if (!cleanText || typing) return;

        const currentMessages = messages;
        const sanitizedText = sanitizeProfanity(cleanText);
        const userMsg: Message = { id: nextMessageId.current++, text: sanitizedText, from: 'user' };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setError('');
        setTyping(true);

        try {
            const response = await assistantService.sendMessage({
                message: sanitizedText,
                screen: 'home',
                history: toAssistantHistory(currentMessages),
            });

            setMessages(prev => [
                ...prev,
                { id: nextMessageId.current++, text: sanitizeProfanity(response.reply), from: 'blu' },
            ]);
        } catch (requestError: unknown) {
            const retryAfter = typeof requestError === 'object' && requestError !== null && 'response' in requestError
                ? (requestError as { response?: { data?: { retryAfterSeconds?: number } } }).response?.data?.retryAfterSeconds
                : undefined;
            const fallback = retryAfter
                ? `Ahora mismo estoy un pelín saturado. Dame ${retryAfter} segundos y lo volvemos a intentar.`
                : 'Ahora mismo me está costando responder. Prueba otra vez en un momentito, ¿vale?';

            setError(fallback);
            setMessages(prev => [...prev, { id: nextMessageId.current++, text: fallback, from: 'blu' }]);
        } finally {
            setTyping(false);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void sendMessage(input);
    };

    return (
        <aside className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 md:bottom-6 md:right-6">
            <section
                id={panelId}
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className={`
                    flex w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem]
                    border border-[#D8CFFF] bg-[#F7F2FF] text-app-primary
                    shadow-[0_24px_70px_rgba(76,65,140,0.22)] dark:border-app-strong dark:bg-app-surface-solid
                    transition-[opacity,transform] duration-200 motion-reduce:transition-none
                    ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}
                `}
                hidden={!open}
            >
                <header className="flex items-center justify-between gap-3 border-b border-[#D8CFFF] bg-[linear-gradient(135deg,#F0EAFF_0%,#E5F3FF_100%)] px-4 py-3.5 dark:border-app-soft dark:bg-none dark:bg-app-surface-strong">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="relative -m-1 flex h-14 w-14 shrink-0 items-center justify-center">
                            <BluAssistantAnimation size="sm" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F7F2FF] bg-green-500 dark:border-app-surface-solid" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                                <h2 id={titleId} className="text-sm font-black leading-tight text-app-primary">
                                    Soy Blu
                                </h2>
                                <span className="rounded-full border border-green-300/70 bg-green-100/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-green-700 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300">
                                    online
                                </span>
                            </div>
                            <p id={descriptionId} className="text-xs font-semibold text-app-secondary">
                                Voy contigo, sin prisas
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={closeAssistant}
                        aria-label="Cerrar asistente Blu"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5CBFF] bg-white/55 text-app-primary shadow-sm transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/40 dark:border-app-soft dark:bg-app-surface-soft dark:hover:bg-app-surface-strong"
                    >
                        <XIcon size={18} weight="bold" aria-hidden="true" />
                    </button>
                </header>

                {messages.length <= 1 && (
                    <div className="border-b border-[#D8CFFF] bg-[#F7F2FF] px-4 py-3.5 dark:border-app-soft dark:bg-app-surface-solid">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-app-muted">
                            ¿Por dónde empezamos?
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {SUGGESTIONS.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => sendMessage(s)}
                                    disabled={typing}
                                    className="min-h-11 rounded-2xl border border-[#D5CBFF] bg-[#EFE8FF] px-3 py-2 text-left text-xs font-bold leading-snug text-app-primary shadow-sm transition-colors hover:bg-[#E8DFFF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-app-strong dark:bg-app-surface-soft dark:hover:bg-app-surface-strong"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div
                    id={logId}
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions text"
                    className="max-h-[min(23rem,48vh)] flex-1 space-y-3 overflow-y-auto bg-[#F1EBFF] px-4 py-4 dark:bg-app-surface"
                >
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <p
                                className={`
                                    max-w-[86%] rounded-[1.15rem] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm
                                    ${msg.from === 'user'
                                        ? 'rounded-br-md bg-[#746CE0] text-white shadow-[#746CE0]/20 dark:bg-app-accent dark:text-app-on-accent'
                                        : 'rounded-bl-md border border-[#D6CCFF] bg-[#FFFDF8] text-app-primary dark:border-app-soft dark:bg-app-surface-solid'
                                    }
                                `}
                            >
                                <span className="sr-only">{msg.from === 'user' ? 'Tu mensaje: ' : 'Blu dice: '}</span>
                                {msg.text}
                            </p>
                        </div>
                    ))}

                    {typing && (
                        <div className="flex justify-start">
                            <p className="rounded-[1.15rem] rounded-bl-md border border-[#D6CCFF] bg-[#FFFDF8] px-4 py-3 text-sm text-app-secondary shadow-sm dark:border-app-soft dark:bg-app-surface-solid">
                                <span className="sr-only">Blu está escribiendo</span>
                                <span aria-hidden="true" className="inline-flex items-center gap-1.5">
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="h-1.5 w-1.5 rounded-full bg-[#746CE0] dark:bg-app-accent"
                                            style={{
                                                animation: 'bluAssistantPulse 1.4s ease-in-out infinite',
                                                animationDelay: `${i * 0.18}s`,
                                            }}
                                        />
                                    ))}
                                </span>
                            </p>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {error && (
                    <p className="border-t border-[#D8CFFF] bg-[#F7F2FF] px-4 py-2 text-xs font-semibold text-red-600 dark:border-app-soft dark:bg-app-surface-solid" role="status">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="border-t border-[#D8CFFF] bg-[#F7F2FF] p-3 dark:border-app-soft dark:bg-app-surface-solid">
                    <label htmlFor={inputId} className="sr-only">
                        Cuéntale a Blu qué necesitas
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-[#D5CBFF] bg-[#EFE8FF] px-3 py-2 shadow-inner shadow-white/50 focus-within:ring-4 focus-within:ring-app-focus/30 dark:border-app-strong dark:bg-app-surface-soft dark:shadow-none">
                        <input
                            id={inputId}
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={event => setInput(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                            placeholder="Cuéntame qué necesitas..."
                            disabled={typing}
                            maxLength={MAX_MESSAGE_LENGTH}
                            aria-controls={logId}
                            className="min-h-9 flex-1 bg-transparent text-sm font-medium text-app-primary placeholder:text-app-muted focus:outline-none disabled:opacity-70"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || typing}
                            aria-label="Enviar mensaje a Blu"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#746CE0] text-white shadow-md shadow-[#746CE0]/20 transition-colors hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/40 disabled:cursor-not-allowed disabled:bg-app-muted disabled:text-app-surface-solid dark:bg-app-accent dark:text-app-on-accent"
                        >
                            <PaperPlaneRightIcon size={16} weight="bold" aria-hidden="true" />
                        </button>
                    </div>
                </form>
            </section>

            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(current => !current)}
                aria-label={open ? 'Cerrar asistente Blu' : 'Abrir asistente Blu'}
                aria-expanded={open}
                aria-controls={panelId}
                className="relative flex h-24 w-24 items-center justify-center overflow-visible bg-transparent p-0 text-app-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/50 motion-reduce:transition-none"
            >
                <span className={`${open ? 'opacity-0' : 'opacity-100'} absolute transition-opacity motion-reduce:transition-none`}>
                    <BluAssistantAnimation />
                </span>
                <span className={`${open ? 'opacity-100' : 'opacity-0'} absolute flex h-14 w-14 items-center justify-center rounded-full bg-[#746CE0] text-white shadow-xl transition-opacity motion-reduce:transition-none dark:bg-app-accent dark:text-app-on-accent`}>
                    <XIcon size={22} weight="bold" aria-hidden="true" />
                </span>
            </button>

            <style>{`
                @keyframes bluAssistantPulse {
                    0%, 100% { opacity: 0.3; transform: translateY(0); }
                    50% { opacity: 0.9; transform: translateY(-1px); }
                }

                .blu-mascot-antenna {
                    animation: bluMascotAntennaIdle 3.2s ease-in-out infinite;
                }

                @keyframes bluMascotAntennaIdle {
                    0%, 100% { transform: rotate(calc(var(--blu-antenna-rotation, 0deg) - 2deg)); }
                    50% { transform: rotate(calc(var(--blu-antenna-rotation, 0deg) + 2deg)); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .blu-mascot-antenna {
                        animation: none;
                    }
                }
            `}</style>
        </aside>
    );
};
