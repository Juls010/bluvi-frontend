import React, { useRef, useState, useEffect } from 'react';
import { PauseIcon, PlayIcon, WarningCircleIcon } from '@phosphor-icons/react';

interface AudioMessageProps {
    audioUrl: string;
    duration?: number;
    isOwn?: boolean;
    transcript?: string | null;
    isTranscribing?: boolean;
    onTranscribe?: () => void;
    isInteractive?: boolean;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioMessage: React.FC<AudioMessageProps> = ({ audioUrl, duration = 0, isOwn = false, transcript, isTranscribing = false, onTranscribe, isInteractive = true }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(duration);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const playbackTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const audio = audioElementRef.current;
        if (!audio) return;

        const updateDuration = () => {
            if (!isNaN(audio.duration)) {
                setTotalDuration(audio.duration);
                setIsLoading(false);
            }
        };

        const updateCurrentTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (playbackTimerRef.current) {
                window.clearInterval(playbackTimerRef.current);
            }
        };

        const handleError = () => {
            setError('No se pudo cargar el audio');
            setIsLoading(false);
        };

        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('timeupdate', updateCurrentTime);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('timeupdate', updateCurrentTime);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
        const audioEl = audioElementRef.current;

        return () => {
            if (audioEl) {
                audioEl.pause();
            }
            if (playbackTimerRef.current) {
                window.clearInterval(playbackTimerRef.current);
            }
        };
    }, []);

    const togglePlayback = () => {
        if (!audioElementRef.current) return;

        if (isPlaying) {
            audioElementRef.current.pause();
            setIsPlaying(false);
            if (playbackTimerRef.current) {
                window.clearInterval(playbackTimerRef.current);
            }
        } else {
            audioElementRef.current.play().catch((err) => {
                console.error('Error playing audio:', err);
                setError('Error al reproducir el audio');
            });
            setIsPlaying(true);

            playbackTimerRef.current = window.setInterval(() => {
                if (audioElementRef.current) {
                    setCurrentTime(audioElementRef.current.currentTime);
                }
            }, 100);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioElementRef.current || totalDuration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * totalDuration;
        audioElementRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!audioElementRef.current || totalDuration === 0) return;
        let newTime = currentTime;
        const step = totalDuration * 0.05;

        if (e.key === 'ArrowRightIcon' || e.key === 'ArrowUp') {
            newTime = Math.min(currentTime + step, totalDuration);
            e.preventDefault();
        } else if (e.key === 'ArrowLeftIcon' || e.key === 'ArrowDown') {
            newTime = Math.max(currentTime - step, 0);
            e.preventDefault();
        } else if (e.key === 'Home') {
            newTime = 0;
            e.preventDefault();
        } else if (e.key === 'End') {
            newTime = totalDuration;
            e.preventDefault();
        }

        audioElementRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const waveformBars = [28, 44, 36, 50, 32, 42, 30];
    const progressRatio = totalDuration > 0 ? currentTime / totalDuration : 0;
    const transcriptionUnavailable = transcript === 'No es posible transcribir';

    if (error) {
        return (
            <div
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-sm ${
                    isOwn 
                        ? 'bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30' 
                        : 'bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/20'
                }`}
                role="alert"
                aria-live="polite"
            >
                <WarningCircleIcon size={20} weight="bold" className="text-red-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>
            </div>
        );
    }

    return (
        <div
            className={`w-full min-w-[230px] flex flex-col gap-2 rounded-2xl px-3 py-3 transition-all duration-300 sm:min-w-[280px] sm:px-4 ${
                isOwn ? 'shadow-md backdrop-blur-sm' : 'bg-app-surface shadow-sm border-2 border-app-strong'
            }`}
            style={isOwn ? { background: 'var(--app-own-message-bg)' } : undefined}
            role="region"
            aria-label="Reproductor de mensaje de audio"
            aria-live="polite"
        >
            <div className="flex items-center gap-2.5 sm:gap-3">
                <audio ref={audioElementRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

                <button
                    type="button"
                    onClick={togglePlayback}
                    disabled={isLoading}
                    aria-label={isPlaying ? 'Pausar reproducción de audio' : 'Reproducir mensaje de audio'}
                    aria-pressed={isPlaying}
                    tabIndex={isInteractive ? 0 : -1}
                    data-own-audio-control={isOwn ? 'true' : undefined}
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-3 focus-visible:shadow-lg sm:h-10 sm:w-10 ${
                        isOwn
                            ? 'focus-visible:ring-app-accent disabled:opacity-50'
                            : 'bg-app-accent/15 hover:bg-app-accent/25 focus-visible:ring-app-accent disabled:opacity-50'
                    } disabled:opacity-50 active:scale-95`}
                    style={isOwn ? { backgroundColor: 'var(--app-own-message-control-bg)' } : undefined}
                >
                    {isPlaying ? (
                        <PauseIcon size={22} weight="bold" className={isOwn ? 'text-app-on-accent' : 'text-app-accent'} style={isOwn ? { color: 'var(--app-own-message-control-text)' } : undefined} aria-hidden="true" />
                    ) : (
                        <PlayIcon size={22} weight="bold" className={isOwn ? 'text-app-on-accent' : 'text-app-accent'} style={isOwn ? { color: 'var(--app-own-message-control-text)' } : undefined} aria-hidden="true" />
                    )}
                </button>

                <div
                    className="flex-1 min-w-0 flex items-center gap-1.5 cursor-pointer"
                    role="slider"
                    aria-label="Barra de progreso de audio"
                    aria-valuemin={0}
                    aria-valuemax={Math.round(totalDuration)}
                    aria-valuenow={Math.round(currentTime)}
                    aria-valuetext={`${formatTime(currentTime)} de ${formatTime(totalDuration)}`}
                    onClick={handleProgressClick}
                    onKeyDown={handleProgressKeyDown}
                    tabIndex={isInteractive ? 0 : -1}
                    title="Haz clic para buscar en el audio"
                >
                    {waveformBars.map((barHeight, index) => {
                        const barTime = (index + 1) / waveformBars.length;
                        const isFilled = progressRatio >= barTime;

                        return (
                            <span
                                key={`${barHeight}-${index}`}
                                className={`w-2 rounded-full transition-all duration-150 sm:w-2.5 ${
                                    !isOwn
                                        ? isFilled
                                            ? 'bg-app-accent'
                                            : 'bg-app-accent/30'
                                        : ''
                                }`}
                                style={{
                                    height: `${Math.max(8, Math.round((barHeight / 50) * 18))}px`,
                                    ...(isOwn ? { backgroundColor: isFilled ? 'var(--app-own-message-bar-filled)' : 'var(--app-own-message-bar-empty)' } : {}),
                                }}
                                aria-hidden="true"
                            />
                        );
                    })}
                </div>

                <span
                    className={`w-10 flex-shrink-0 text-right font-mono text-[13px] font-semibold sm:w-11 sm:text-[14px] ${isOwn ? '' : 'text-app-secondary'}`}
                    style={isOwn ? { color: 'var(--app-own-message-muted)' } : undefined}
                    aria-label={`Duración total: ${isLoading ? 'cargando' : formatTime(totalDuration)}`}
                >
                    {isLoading ? '--:--' : formatTime(totalDuration)}
                </span>
            </div>

            {transcript ? (
                transcriptionUnavailable ? (
                    <div
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isOwn ? '' : 'bg-app-surface-soft text-app-muted'}`}
                        style={isOwn ? { backgroundColor: 'var(--app-own-message-content-bg)', color: 'var(--app-own-message-muted)' } : undefined}
                    >
                        <WarningCircleIcon size={14} weight="bold" className={isOwn ? '' : 'text-app-muted'} style={isOwn ? { color: 'var(--app-own-message-muted)' } : undefined} aria-hidden="true" />
                        <span className="font-medium">No es posible transcribir</span>
                    </div>
                ) : (
                    <div
                        className={`rounded-xl px-3 py-2 text-sm leading-6 whitespace-pre-wrap ${isOwn ? '' : 'bg-app-surface-soft text-app-primary'}`}
                        style={isOwn ? { backgroundColor: 'var(--app-own-message-content-bg)', color: 'var(--app-own-message-text)' } : undefined}
                    >
                        {transcript}
                    </div>
                )
            ) : onTranscribe ? (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onTranscribe}
                        disabled={isTranscribing || isLoading}
                        tabIndex={isInteractive ? 0 : -1}
                        data-own-audio-control={isOwn ? 'true' : undefined}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-50 ${
                            isOwn
                                ? 'focus-visible:ring-app-accent'
                                : 'bg-app-accent/10 text-app-primary hover:bg-app-accent/15 focus-visible:ring-app-accent'
                        }`}
                        style={isOwn ? { backgroundColor: 'var(--app-own-message-control-bg)', color: 'var(--app-own-message-control-text)' } : undefined}
                    >
                        {isTranscribing ? 'Transcribiendo...' : 'Transcribir'}
                    </button>
                </div>
            ) : null}
        </div>
    );
};
