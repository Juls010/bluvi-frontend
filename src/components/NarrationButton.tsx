import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowClockwiseIcon, PauseIcon, PlayIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import { getNarrationAudio } from '../services/narration.service';

interface NarrationButtonProps {
    text: string;
    label?: string;
    className?: string;
    allowBrowserFallback?: boolean;
}

type NarrationState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

const getSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return null;
    }

    return window.speechSynthesis;
};

export const NarrationButton: React.FC<NarrationButtonProps> = ({
    text,
    label = 'Escuchar esta pantalla',
    className = '',
    allowBrowserFallback = false,
}) => {
    const statusId = useId();
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);
    const [state, setState] = useState<NarrationState>('idle');
    const [usingFallback, setUsingFallback] = useState(false);

    const statusText = useMemo(() => {
        if (state === 'loading') return 'Preparando narracion';
        if (state === 'playing') return usingFallback ? 'Narracion local en curso' : 'Narracion en curso';
        if (state === 'paused') return 'Narracion pausada';
        if (state === 'error') return 'No se pudo preparar la narracion';
        return 'Narracion detenida';
    }, [state, usingFallback]);

    const clearAudioUrl = useCallback(() => {
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
        }
    }, []);

    const stopNarration = useCallback(() => {
        getSpeechSynthesis()?.cancel();
        utteranceRef.current = null;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }

        clearAudioUrl();
        setUsingFallback(false);
        setState('idle');
    }, [clearAudioUrl]);

    useEffect(() => {
        return () => {
            stopNarration();
        };
    }, [stopNarration]);

    const startSpeechFallback = useCallback(() => {
        const synth = getSpeechSynthesis();
        if (!synth) {
            setState('error');
            return;
        }

        synth.cancel();
        setUsingFallback(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.92;
        utterance.pitch = 1;

        utterance.onstart = () => setState('playing');
        utterance.onresume = () => setState('playing');
        utterance.onpause = () => setState('paused');
        utterance.onend = () => {
            utteranceRef.current = null;
            setUsingFallback(false);
            setState('idle');
        };
        utterance.onerror = () => {
            utteranceRef.current = null;
            setUsingFallback(false);
            setState('error');
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
    }, [text]);

    const startAudioNarration = useCallback(async () => {
        stopNarration();
        setState('loading');

        try {
            const audioBlob = await getNarrationAudio(text);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audioUrlRef.current = audioUrl;
            audioRef.current = audio;

            audio.onplay = () => setState('playing');
            audio.onpause = () => {
                if (!audio.ended) setState('paused');
            };
            audio.onended = () => {
                clearAudioUrl();
                audioRef.current = null;
                setState('idle');
            };
            audio.onerror = () => {
                clearAudioUrl();
                audioRef.current = null;

                if (allowBrowserFallback) {
                    startSpeechFallback();
                    return;
                }

                setState('error');
            };

            await audio.play();
        } catch (error) {
            console.error('Error cargando narracion Voipi:', error);

            if (allowBrowserFallback) {
                startSpeechFallback();
                return;
            }

            setState('error');
        }
    }, [allowBrowserFallback, clearAudioUrl, startSpeechFallback, stopNarration, text]);

    const toggleNarration = () => {
        if (state === 'loading') return;

        if (state === 'playing') {
            if (usingFallback) {
                getSpeechSynthesis()?.pause();
            } else {
                audioRef.current?.pause();
            }
            setState('paused');
            return;
        }

        if (state === 'paused') {
            if (usingFallback) {
                getSpeechSynthesis()?.resume();
            } else {
                void audioRef.current?.play();
            }
            setState('playing');
            return;
        }

        void startAudioNarration();
    };

    const Icon = state === 'loading' ? SpinnerGapIcon : state === 'playing' ? PauseIcon : PlayIcon;
    const buttonLabel = state === 'loading'
        ? 'Preparando narracion'
        : state === 'playing'
            ? 'Pausar narracion'
            : state === 'paused'
                ? 'Reanudar narracion'
                : state === 'error'
                    ? 'Reintentar narracion'
                    : label;

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            <button
                type="button"
                onClick={toggleNarration}
                disabled={state === 'loading'}
                aria-describedby={statusId}
                aria-pressed={state === 'playing'}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40 disabled:cursor-wait disabled:opacity-75 motion-reduce:transition-none"
                style={{
                    backgroundColor: 'var(--app-control-surface)',
                    borderColor: 'var(--app-control-border)',
                    color: 'var(--app-control-neutral)',
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor = 'var(--app-control-surface-hover)';
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor = 'var(--app-control-surface)';
                }}
            >
                <Icon className={`h-4 w-4 ${state === 'loading' ? 'animate-spin motion-reduce:animate-none' : ''}`} weight="bold" aria-hidden="true" />
                {buttonLabel}
            </button>

            {(state === 'playing' || state === 'paused') && (
                <button
                    type="button"
                    onClick={stopNarration}
                    aria-label="Detener narracion"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500/40 motion-reduce:transition-none"
                    style={{
                        backgroundColor: 'var(--app-control-surface)',
                        borderColor: 'var(--app-control-border)',
                        color: 'var(--app-control-neutral-muted)',
                    }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface-hover)';
                    }}
                    onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface)';
                    }}
                >
                    <ArrowClockwiseIcon className="h-4 w-4" weight="bold" aria-hidden="true" />
                </button>
            )}

            <span id={statusId} className="sr-only" role="status" aria-live="polite">
                {statusText}
            </span>
        </div>
    );
};

export default NarrationButton;
