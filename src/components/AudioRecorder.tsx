import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { MicrophoneIcon, PaperPlaneRightIcon, PauseIcon, PlayIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react';
import { Button as AppButton } from './Button';
import { Tooltip, TooltipTrigger } from './Tooltip';

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
    const [justStoppedRecording, setJustStoppedRecording] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const playbackTimerRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

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

            timerRef.current = window.setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);

            updateAudioLevel();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setAudioError('No se pudo acceder al micrófono. Revisa los permisos del navegador y vuelve a intentarlo.');
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
            setAudioError('No se pudo enviar el audio. Inténtalo de nuevo.');
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

    const audioErrorModal = (
        <ModalOverlay
            isOpen={Boolean(audioError)}
            onOpenChange={(open) => {
                if (!open) setAudioError(null);
            }}
            isDismissable
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md animate-fade-in"
        >
            <Modal className="w-full max-w-sm outline-none">
                <Dialog
                    role="alertdialog"
                    aria-describedby="audio-error-modal-desc"
                    className="w-full rounded-[2rem] border-2 border-app-strong bg-app-surface-solid p-6 text-center text-app-primary shadow-2xl outline-none"
                >
                    <div
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-app-accent/10 text-app-accent-strong"
                        aria-hidden="true"
                    >
                        <WarningIcon size={30} weight="bold" />
                    </div>

                    <Heading slot="title" className="font-heading text-xl font-bold text-app-primary">
                        Audio no disponible
                    </Heading>

                    <p id="audio-error-modal-desc" className="mt-3 text-sm font-medium leading-relaxed text-app-secondary">
                        {audioError}
                    </p>

                    <AppButton
                        autoFocus
                        onClick={() => setAudioError(null)}
                        className="mt-6 w-full bg-bluvi-purple py-3.5 text-sm text-white shadow-md"
                    >
                        Entendido
                    </AppButton>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );

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

                    <div className="flex items-center flex-shrink-0">
                        <span className="text-xs font-semibold text-app-accent uppercase tracking-wide">Grabando</span>
                    </div>

                    <span
                        className="text-sm font-mono font-semibold text-app-primary flex-shrink-0"
                        aria-live="off"
                        aria-label={`Duración de grabación: ${formatTime(duration)}`}
                    >
                        {formatTime(duration)}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={stopRecording}
                    disabled={disabled}
                    aria-label={`Detener grabación de ${formatTime(duration)}`}
                    className="p-2.5 rounded-full transition-all flex-shrink-0 bg-red-500 hover:bg-red-600 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                    <MicrophoneIcon size={20} weight="bold" aria-hidden="true" />
                </button>
            </div>
        );
    }

    if (!recordedAudio && !justStoppedRecording) {
        return (
            <>
                <TooltipTrigger delay={300}>
                    <button
                        type="button"
                        onClick={() => void startRecording()}
                        disabled={disabled}
                        aria-label="Grabar mensaje de audio"
                        className="p-2.5 rounded-xl transition-all flex-shrink-0 bg-app-surface-soft hover:bg-app-surface-strong text-app-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MicrophoneIcon size={20} weight="bold" aria-hidden="true" />
                    </button>
                    <Tooltip>Grabar audio</Tooltip>
                </TooltipTrigger>
                {audioErrorModal}
            </>
        );
    }

    return (
        <>
        <div className={`flex items-center gap-2 ${fullWidth ? 'w-full flex-1' : 'flex-shrink-0'}`}>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border-2 border-app-soft bg-app-surface px-3 py-2 shadow-sm">
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
                    <PauseIcon size={18} weight="bold" className="text-app-accent" aria-hidden="true" />
                ) : (
                    <PlayIcon size={18} weight="bold" className="text-app-accent" aria-hidden="true" />
                )}
            </button>

            <span
                className="text-xs font-mono text-app-secondary"
                aria-label={isPlaying ? `Tiempo actual: ${formatTime(currentTime)}` : `Duración del audio: ${formatTime(duration)}`}
            >
                {isPlaying ? formatTime(currentTime) : formatTime(duration)}
            </span>

            <div className="h-1 min-w-20 flex-1 rounded-full bg-app-surface-soft overflow-hidden">
                <div
                    className="h-full bg-app-accent transition-all"
                    style={{
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                    }}
                    aria-hidden="true"
                />
            </div>
        </div>

            <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                aria-label={`Enviar audio de ${formatTime(duration)}`}
                className="p-2 rounded-lg bg-app-accent hover:opacity-90 text-app-on-accent transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50"
            >
                <PaperPlaneRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={cancelRecording}
                disabled={isSending}
                aria-label="Cancelar grabación y descartar audio"
                className="p-2 rounded-lg hover:bg-app-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
                <TrashIcon size={18} weight="bold" className="text-app-secondary" aria-hidden="true" />
            </button>
        </div>
        {audioErrorModal}
        </>
    );
};

