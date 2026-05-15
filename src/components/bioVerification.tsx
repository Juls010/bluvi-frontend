import {
    useCallback,
    useEffect,
    useRef,
    useState } from 'react';
import { Dialog,
    Heading,
    Modal,
    ModalOverlay } from 'react-aria-components';
import type { Icon
} from '@phosphor-icons/react';
import {
    ArrowClockwiseIcon,
    CheckIcon,
    EyeIcon,
    ShieldCheckIcon,
    SmileyIcon,
    SparkleIcon,
    VideoCameraIcon,
    WarningCircleIcon,
    XIcon
} from '@phosphor-icons/react';
import { FaceLandmarker, type FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { detectarGesto, inicializarFaceDetector, type GestoReconocido } from '../services/faceDetector.service';
import { Button } from './Button';

interface FaceVerificationProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified?: () => void | Promise<void>;
}

type VerificationGesture = Exclude<GestoReconocido, 'NINGUNO'>;
type SecondStepGesture = Exclude<VerificationGesture, 'SONRISA'>;

const GESTURE_CONTENT: Record<VerificationGesture, {
    title: string;
    hint: string;
    Icon: Icon;
}> = {
    SONRISA: {
        title: 'Sonríe',
        hint: 'Mira a cámara y muestra una sonrisa natural.',
        Icon: SmileyIcon
    },
    GUINO_DERECHO: {
        title: 'Guiña el ojo derecho',
        hint: 'Mantente dentro del círculo y haz un guiño claro.',
        Icon: EyeIcon
    },
    BOCA_ABIERTA: {
        title: 'Abre la boca',
        hint: 'Mantente dentro del círculo y abre la boca de forma clara.',
        Icon: SmileyIcon
    }
};

const getAlternativeGesture = (gesture: SecondStepGesture): SecondStepGesture => (
    gesture === 'GUINO_DERECHO' ? 'BOCA_ABIERTA' : 'GUINO_DERECHO'
);

const getCameraErrorMessage = (err: unknown) => {
    if (err instanceof DOMException) {
        if (err.name === 'NotFoundError') {
            return 'No hemos encontrado una cámara conectada a este dispositivo.';
        }

        if (err.name === 'NotAllowedError') {
            return 'Necesitamos permiso para usar la cámara durante esta verificación.';
        }

        if (err.name === 'NotReadableError') {
            return 'La cámara parece estar siendo usada por otra aplicación.';
        }
    }

    return 'No se ha podido iniciar la verificación facial.';
};

const FaceVerification: React.FC<FaceVerificationProps> = ({ isOpen, onClose, onVerified }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const requestRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const predictWebcamRef = useRef<((time: number) => void) | null>(null);
    const verificationInProgressRef = useRef(false);

    const [gestoSolicitado, setGestoSolicitado] = useState<VerificationGesture>('SONRISA');
    const [segundoGesto, setSegundoGesto] = useState<SecondStepGesture>('GUINO_DERECHO');
    const [pasoActual, setPasoActual] = useState(1);
    const [verificado, setVerificado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    const currentStep = GESTURE_CONTENT[gestoSolicitado];
    const CurrentStepIcon = currentStep.Icon;
    const alternativeGesture = getAlternativeGesture(segundoGesto);
    const alternativeStep = GESTURE_CONTENT[alternativeGesture];
    const stepIndicators = [GESTURE_CONTENT.SONRISA, GESTURE_CONTENT[segundoGesto]];

    const stopCamera = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const resetVerification = useCallback(() => {
        setGestoSolicitado('SONRISA');
        setSegundoGesto('GUINO_DERECHO');
        setPasoActual(1);
        setVerificado(false);
        setGuardando(false);
        setCameraError(null);
        verificationInProgressRef.current = false;
    }, []);

    const procesarResultados = useCallback(async (results: FaceLandmarkerResult) => {
        if (verificationInProgressRef.current) return;

        const gestoDetectado = detectarGesto(results);

        if (gestoDetectado !== gestoSolicitado) return;

        if (pasoActual === 1) {
            setGestoSolicitado(segundoGesto);
            setPasoActual(2);
            return;
        }

        verificationInProgressRef.current = true;
        setGuardando(true);
        stopCamera();

        try {
            await onVerified?.();
            setVerificado(true);
        } catch (err) {
            console.error('Error guardando verificación facial', err);
            setCameraError('Hemos detectado el gesto, pero no se pudo guardar la verificación. Inténtalo de nuevo.');
            verificationInProgressRef.current = false;
        } finally {
            setGuardando(false);
        }
    }, [gestoSolicitado, onVerified, pasoActual, segundoGesto, stopCamera]);

    const predictWebcam = useCallback((time: number) => {
        if (faceLandmarkerRef.current && videoRef.current) {
            const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, time);

            if (results) {
                void procesarResultados(results);
            }
        }

        requestRef.current = requestAnimationFrame((nextTime) => {
            predictWebcamRef.current?.(nextTime);
        });
    }, [procesarResultados]);

    useEffect(() => {
        predictWebcamRef.current = predictWebcam;

        return () => {
            predictWebcamRef.current = null;
        };
    }, [predictWebcam]);

    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            return;
        }

        let mounted = true;

        const setup = async () => {
            setCargando(true);
            resetVerification();
            stopCamera();

            try {
                faceLandmarkerRef.current = await inicializarFaceDetector();
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 720 },
                        height: { ideal: 720 }
                    }
                });

                if (!mounted) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        if (!mounted) return;
                        setCargando(false);
                        requestRef.current = requestAnimationFrame((time) => {
                            predictWebcamRef.current?.(time);
                        });
                    };
                }
            } catch (err) {
                console.error('Error inicializando detector o cámara', err);

                if (mounted) {
                    setCameraError(getCameraErrorMessage(err));
                    setCargando(false);
                    stopCamera();
                }
            }
        };

        setup();

        return () => {
            mounted = false;
            stopCamera();
        };
    }, [isOpen, resetVerification, retryKey, stopCamera]);

    const handleRetry = () => {
        setRetryKey((value) => value + 1);
    };

    const handleUseAlternativeGesture = () => {
        if (pasoActual !== 2 || guardando) return;

        const nextGesture = getAlternativeGesture(segundoGesto);
        setSegundoGesto(nextGesture);
        setGestoSolicitado(nextGesture);
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open && !guardando) onClose();
            }}
            isDismissable={!guardando}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 animate-fade-in motion-reduce:animate-none dark:bg-black/85"
        >
            <Modal className="w-full max-w-xl outline-none">
                <Dialog
                    aria-describedby="face-verification-description"
                    className="relative w-full overflow-hidden rounded-[2rem] border-2 border-app-strong bg-app-surface-solid text-app-primary shadow-2xl outline-none"
                >
                    <button
                        onClick={onClose}
                        disabled={guardando}
                        className="absolute right-4 top-4 z-20 rounded-full p-2 text-app-muted transition-all hover:bg-app-surface-soft hover:text-app-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-app-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                        aria-label="Cerrar verificación facial"
                    >
                        <XIcon className="h-5 w-5" weight="bold" />
                    </button>

                    <div className="absolute inset-x-0 top-0 h-1 bg-app-accent-gradient" />

                    <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8">
                        <div className="mb-5 flex items-start gap-3 pr-10">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-app-accent/10 text-app-accent-strong dark:bg-app-orange/15 dark:text-app-orange">
                                <ShieldCheckIcon className="h-6 w-6" weight="bold" />
                            </div>
                            <div>
                                <Heading slot="title" className="font-heading text-2xl font-bold text-app-primary">
                                    Verificación facial
                                </Heading>
                                <p id="face-verification-description" className="mt-1 text-sm leading-relaxed text-app-secondary">
                                    Confirma que eres tú con dos gestos rápidos frente a la cámara. Puedes cambiar el segundo gesto si el guiño no te resulta cómodo.
                                </p>
                            </div>
                        </div>

                        {cameraError ? (
                            <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-5 text-center dark:border-red-300 dark:bg-red-950">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                    <WarningCircleIcon className="h-7 w-7" weight="bold" />
                                </div>
                                <h3 className="font-heading text-lg font-bold text-app-primary">No se pudo completar la verificación</h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-app-secondary">{cameraError}</p>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        onClick={onClose}
                                        className="flex-1 !bg-app-surface !text-app-secondary border-2 !border-app-soft shadow-sm"
                                    >
                                        Cerrar
                                    </Button>
                                    <Button onClick={handleRetry} className="flex-1 bg-bluvi-purple text-white">
                                        <ArrowClockwiseIcon className="mr-2 inline h-4 w-4" weight="bold" />
                                        Reintentar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
                                <div className="flex justify-center">
                                    <div className="relative h-64 w-64 max-w-full sm:h-72 sm:w-72">
                                        <div className="absolute inset-0 rounded-full bg-app-accent-gradient opacity-30 blur-xl" />
                                        <div className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-app-soft bg-app-surface-soft shadow-xl">
                                            <video
                                                aria-hidden="true"
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="h-full w-full scale-x-[-1] object-cover"
                                            />

                                            <div className="pointer-events-none absolute inset-4 rounded-full border border-white/70 dark:border-white/25" />

                                            {cargando && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-app-surface-solid/95">
                                                    <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-app-accent/20 border-t-app-accent motion-reduce:animate-none" />
                                                    <p className="text-sm font-bold text-app-secondary">Preparando cámara</p>
                                                </div>
                                            )}

                                            {guardando && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-app-surface-solid/95" role="status" aria-live="polite" aria-atomic="true">
                                                    <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-app-accent/20 border-t-app-accent motion-reduce:animate-none" />
                                                    <p className="text-sm font-bold text-app-secondary">Guardando verificación</p>
                                                </div>
                                            )}

                                            {verificado && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/90 text-white">
                                                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                                        <CheckIcon className="h-9 w-9" weight="bold" />
                                                    </div>
                                                    <p className="font-heading text-xl font-bold">Verificado</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border-2 border-app-soft bg-app-surface-solid p-4">
                                    {!verificado ? (
                                        <>
                                            <div className="mb-4 flex items-center gap-2" aria-hidden="true">
                                                {stepIndicators.map((step, index) => {
                                                    const StepIcon = step.Icon;
                                                    const isActive = pasoActual === index + 1;
                                                    const isDone = pasoActual > index + 1 || guardando;

                                                    return (
                                                        <div
                                                            key={`${step.title}-${index}`}
                                                            className={`flex h-10 flex-1 items-center justify-center rounded-2xl border transition-all motion-reduce:transition-none ${
                                                                isDone
                                                                    ? 'border-emerald-400 bg-emerald-400 text-white'
                                                                    : isActive
                                                                        ? 'border-app-accent bg-app-accent text-white'
                                                                        : 'border-app-soft bg-app-surface-soft text-app-muted'
                                                            }`}
                                                        >
                                                            {isDone ? <CheckIcon className="h-4 w-4" weight="bold" /> : <StepIcon className="h-4 w-4" weight="bold" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <p className="text-xs font-black uppercase tracking-[0.14em] text-app-muted">
                                                Paso {pasoActual} de 2
                                            </p>
                                            <div className="mt-3 flex items-start gap-3" role="status" aria-live="polite" aria-atomic="true">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-app-pill text-app-accent-strong dark:text-app-orange">
                                                    <CurrentStepIcon className="h-5 w-5" weight="bold" />
                                                </div>
                                                <div>
                                                    <h3 className="font-heading text-lg font-bold text-app-primary">
                                                        {guardando ? 'Guardando verificación' : currentStep.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm leading-relaxed text-app-secondary">
                                                        {guardando ? 'Hemos detectado el gesto. Espera un momento mientras guardamos el resultado.' : currentStep.hint}
                                                    </p>
                                                </div>
                                            </div>

                                            {pasoActual === 2 && !guardando && (
                                                <button
                                                    type="button"
                                                    onClick={handleUseAlternativeGesture}
                                                    className="mt-4 w-full rounded-2xl border-2 border-app-soft bg-app-surface px-3 py-2.5 text-sm font-bold text-app-accent-strong transition-colors hover:bg-app-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-app-accent motion-reduce:transition-none"
                                                >
                                                    Usar alternativa: {alternativeStep.title.toLowerCase()}
                                                </button>
                                            )}

                                            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-app-soft bg-app-surface-solid px-3 py-3 text-sm font-semibold text-app-secondary">
                                                <VideoCameraIcon className="h-4 w-4 shrink-0 text-app-accent dark:text-app-orange" weight="bold" />
                                                La imagen solo se usa para confirmar el gesto en este momento.
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2 text-center" role="status" aria-live="polite" aria-atomic="true">
                                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                                <SparkleIcon className="h-7 w-7" weight="bold" />
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-app-primary">Listo</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-app-secondary">
                                                Tu perfil queda marcado como verificado.
                                            </p>
                                            <Button onClick={onClose} className="mt-5 w-full bg-bluvi-purple text-white">
                                                Continuar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default FaceVerification;
