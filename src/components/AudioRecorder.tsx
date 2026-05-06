import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Play, Pause, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
    onSendAudio: (audioBlob: Blob, duration: number) => Promise<void>;
    disabled?: boolean;
    onRecordingStateChange?: (isRecording: boolean) => void;
    onRecordingCancelled?: () => void;
    fullWidth?: boolean;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSendAudio, disabled = false, onRecordingStateChange, onRecordingCancelled, fullWidth = false }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [dotCount, setDotCount] = useState(0);
    const [justStoppedRecording, setJustStoppedRecording] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const playbackTimerRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const dotTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!audioElementRef.current || !recordedAudio) return;

        const audioUrl = URL.createObjectURL(recordedAudio);
        audioElementRef.current.src = audioUrl;

        return () => {
            URL.revokeObjectURL(audioUrl);
        };
    }, [recordedAudio]);

    useEffect(() => {
        const audioEl = audioElementRef.current;

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
            if (playbackTimerRef.current) window.clearInterval(playbackTimerRef.current);
            if (dotTimerRef.current) window.clearInterval(dotTimerRef.current);
            if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
            if (audioEl) audioEl.pause();
        };
    }, []);

    const updateAudioLevel = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const level = Math.min(100, (average / 256) * 150);
        setAudioLevel(level);

        animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyserRef.current = analyser;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setRecordedAudio(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
                setAudioLevel(0);
                if (animationRef.current) {
                    window.cancelAnimationFrame(animationRef.current);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            onRecordingStateChange?.(true);
            setDuration(0);
            setCurrentTime(0);
            setDotCount(0);

            timerRef.current = window.setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);

            // Animación de puntos suspensivos
            dotTimerRef.current = window.setInterval(() => {
                setDotCount((prev) => (prev + 1) % 4);
            }, 500);

            updateAudioLevel();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('No se pudo acceder al micrófono. Verifica los permisos.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setJustStoppedRecording(true);
            onRecordingStateChange?.(false);

            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (dotTimerRef.current) {
                window.clearInterval(dotTimerRef.current);
                dotTimerRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            if (animationRef.current) {
                window.cancelAnimationFrame(animationRef.current);
            }
        }
    };

    const playAudio = () => {
        if (!recordedAudio || !audioElementRef.current) return;

        if (isPlaying) {
            audioElementRef.current.pause();
            setIsPlaying(false);
            if (playbackTimerRef.current) {
                window.clearInterval(playbackTimerRef.current);
            }
        } else {
            audioElementRef.current.play();
            setIsPlaying(true);

            playbackTimerRef.current = window.setInterval(() => {
                setCurrentTime(audioElementRef.current?.currentTime || 0);
            }, 100);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (playbackTimerRef.current) {
            window.clearInterval(playbackTimerRef.current);
        }
    };

    const handleSend = async () => {
        if (!recordedAudio) return;

        try {
            setIsSending(true);
            await onSendAudio(recordedAudio, duration);
            setRecordedAudio(null);
            setDuration(0);
            setCurrentTime(0);
            setJustStoppedRecording(false);
            if (audioElementRef.current) {
                audioElementRef.current.src = '';
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            alert('Error al enviar el audio. Intenta de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    const cancelRecording = () => {
        setRecordedAudio(null);
        setDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
        setJustStoppedRecording(false);
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current.src = '';
        }
        onRecordingCancelled?.();
    };

    // Modo grabando
    if (isRecording) {
        return (
            <div
                className="flex-1 bg-app-surface border border-app-soft rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3"
                role="status"
                aria-live="polite"
                aria-label="Estado de grabación de audio"
            >
                <audio
                    ref={audioElementRef}
                    onEnded={handleAudioEnded}
                    className="hidden"
                />

                <div className="flex items-center gap-2 flex-1">
                    {/* Visualizador de audio */}
                    <div className="flex items-center gap-1 h-8" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-app-accent rounded-full transition-all duration-75"
                                style={{
                                    height: `${Math.max(4, audioLevel * (0.6 + i * 0.15))}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Indicador de grabación */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs font-semibold text-app-accent uppercase tracking-wide">Grabando</span>
                        <span className="text-xs text-app-accent" style={{ width: '12px' }} aria-hidden="true">
                            {'•'.repeat(dotCount)}
                        </span>
                    </div>

                    {/* Tiempo */}
                    <span
                        className="text-sm font-mono font-semibold text-app-primary flex-shrink-0"
                        aria-live="off"
                        aria-label={`Duración de grabación: ${formatTime(duration)}`}
                    >
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Botón para detener */}
                <button
                    type="button"
                    onClick={stopRecording}
                    disabled={disabled}
                    aria-label={`Detener grabación de ${formatTime(duration)}`}
                    className="p-2.5 rounded-full transition-all flex-shrink-0 bg-red-500 hover:bg-red-600 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                    <Mic size={20} aria-hidden="true" />
                </button>
            </div>
        );
    }

    // Si no hay audio grabado y no acabamos de parar, mostrar botón de grabar
    if (!recordedAudio && !justStoppedRecording) {
        return (
            <button
                type="button"
                onClick={startRecording}
                disabled={disabled}
                aria-label="Grabar mensaje de audio"
                className="p-2.5 rounded-xl transition-all flex-shrink-0 bg-app-surface-soft hover:bg-app-surface-strong text-app-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent cursor-pointer"
            >
                <Mic size={20} aria-hidden="true" />
            </button>
        );
    }

    // Mostrar preview del audio grabado (después de parar de grabar)
    return (
        <div className={`flex items-center gap-2 bg-app-surface-soft rounded-2xl px-4 py-3 ${fullWidth ? 'flex-1' : 'flex-shrink-0'}`}>
            <audio
                ref={audioElementRef}
                onEnded={handleAudioEnded}
                className="hidden"
            />

            <button
                type="button"
                onClick={playAudio}
                disabled={isSending}
                aria-label={isPlaying ? 'Pausar reproducción' : 'Reproducir audio grabado'}
                aria-pressed={isPlaying}
                className="p-2 rounded-lg hover:bg-app-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            >
                {isPlaying ? (
                    <Pause size={18} className="text-app-accent" aria-hidden="true" />
                ) : (
                    <Play size={18} className="text-app-accent" aria-hidden="true" />
                )}
            </button>

            <span
                className="text-xs font-mono text-app-secondary"
                aria-label={isPlaying ? `Tiempo actual: ${formatTime(currentTime)}` : `Duración del audio: ${formatTime(duration)}`}
            >
                {isPlaying ? formatTime(currentTime) : formatTime(duration)}
            </span>

            <div className="flex-1 h-1 bg-app-surface rounded-full overflow-hidden">
                <div
                    className="h-full bg-app-accent transition-all"
                    style={{
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                    }}
                    aria-hidden="true"
                />
            </div>

            <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                aria-label={`Enviar audio de ${formatTime(duration)}`}
                className="p-2 rounded-lg bg-app-accent hover:opacity-90 text-white transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50"
            >
                <Send size={18} aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={cancelRecording}
                disabled={isSending}
                aria-label="Cancelar grabación y descartar audio"
                className="p-2 rounded-lg hover:bg-app-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
                <Trash2 size={18} className="text-app-secondary" aria-hidden="true" />
            </button>
        </div>
    );
};

