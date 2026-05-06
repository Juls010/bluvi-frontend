import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, AlertCircle, Sparkles } from 'lucide-react';

interface AudioMessageProps {
    audioUrl: string;
    duration?: number;
    isOwn?: boolean;
    transcript?: string | null;
    isTranscribing?: boolean;
    onTranscribe?: () => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioMessage: React.FC<AudioMessageProps> = ({ audioUrl, duration = 0, isOwn = false, transcript, isTranscribing = false, onTranscribe }) => {
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

        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            newTime = Math.min(currentTime + step, totalDuration);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
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
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">{error}</span>
            </div>
        );
    }

    return (
        <div
            className={`w-full min-w-[280px] flex flex-col gap-2 px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                isOwn ? 'shadow-md' : 'bg-gradient-to-br from-app-surface to-app-surface/80 shadow-md border border-app-surface-soft/50'
            }`}
            style={isOwn ? { background: 'var(--app-own-message-bg)' } : undefined}
            role="region"
            aria-label="Reproductor de mensaje de audio"
            aria-live="polite"
        >
            <div className="flex items-center gap-3">
                <audio ref={audioElementRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

                <button
                    type="button"
                    onClick={togglePlayback}
                    disabled={isLoading}
                    aria-label={isPlaying ? 'Pausar reproducción de audio' : 'Reproducir mensaje de audio'}
                    aria-pressed={isPlaying}
                    className={`flex-shrink-0 w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-3 focus-visible:shadow-lg ${
                        isOwn
                            ? 'bg-white/20 hover:bg-white/30 focus-visible:ring-white disabled:opacity-50'
                            : 'bg-app-accent/15 hover:bg-app-accent/25 focus-visible:ring-app-accent disabled:opacity-50'
                    } disabled:opacity-50 active:scale-95`}
                >
                    {isPlaying ? (
                        <Pause size={24} className={isOwn ? 'text-white' : 'text-app-accent'} aria-hidden="true" />
                    ) : (
                        <Play size={24} className={isOwn ? 'text-white' : 'text-app-accent'} aria-hidden="true" />
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
                    tabIndex={0}
                    title="Haz clic para buscar en el audio"
                >
                    {waveformBars.map((barHeight, index) => {
                        const barTime = (index + 1) / waveformBars.length;
                        const isFilled = progressRatio >= barTime;

                        return (
                            <span
                                key={`${barHeight}-${index}`}
                                className={`w-2.5 rounded-full transition-all duration-150 ${
                                    isOwn
                                        ? isFilled
                                            ? 'bg-white'
                                            : 'bg-white/35'
                                        : isFilled
                                            ? 'bg-app-accent'
                                            : 'bg-app-accent/30'
                                }`}
                                style={{ height: `${Math.max(8, Math.round((barHeight / 50) * 18))}px` }}
                                aria-hidden="true"
                            />
                        );
                    })}
                </div>

                <span
                    className={`w-11 text-right text-[14px] font-mono font-semibold flex-shrink-0 ${isOwn ? 'text-white/90' : 'text-app-secondary'}`}
                    aria-label={`Duración total: ${isLoading ? 'cargando' : formatTime(totalDuration)}`}
                >
                    {isLoading ? '--:--' : formatTime(totalDuration)}
                </span>
            </div>

            {transcript ? (
                transcriptionUnavailable ? (
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isOwn ? 'bg-white/10 text-white/90' : 'bg-app-surface-soft text-app-muted'}`}>
                        <AlertCircle size={14} className={isOwn ? 'text-white/80' : 'text-app-muted'} aria-hidden="true" />
                        <span className="font-medium">No es posible transcribir</span>
                    </div>
                ) : (
                    <div className={`rounded-xl px-3 py-2 text-sm leading-6 whitespace-pre-wrap ${isOwn ? 'bg-white/10 text-white/95' : 'bg-app-surface-soft text-app-primary'}`}>
                        {transcript}
                    </div>
                )
            ) : onTranscribe ? (
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onTranscribe}
                        disabled={isTranscribing || isLoading}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-50 ${
                            isOwn
                                ? 'bg-white/12 text-white hover:bg-white/20 focus-visible:ring-white'
                                : 'bg-app-accent/10 text-app-primary hover:bg-app-accent/15 focus-visible:ring-app-accent'
                        }`}
                    >
                        <Sparkles size={14} />
                        {isTranscribing ? 'Transcribiendo...' : 'Transcribir'}
                    </button>
                </div>
            ) : null}
        </div>
    );
};
