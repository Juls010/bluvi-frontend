import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

const REGISTER_STEP_PRELOADERS: Record<string, () => Promise<unknown>> = {
    '/register/name': () => import('../pages/Register/NameStep'),
    '/register/age': () => import('../pages/Register/AgeStep'),
    '/register/gender': () => import('../pages/Register/GenderStep'),
    '/register/sexuality': () => import('../pages/Register/SexualityStep'),
    '/register/neurodivergence': () => import('../pages/Register/NeurodivergenceStep'),
    '/register/communication': () => import('../pages/Register/CommunicationsStyleStep'),
    '/register/email': () => import('../pages/Register/EmailStep'),
    '/register/photos': () => import('../pages/Register/PhotoUploadStep'),
    '/register/location': () => import('../pages/Register/LocationStep'),
    '/register/interests': () => import('../pages/Register/InterestsStep'),
    '/register/description': () => import('../pages/Register/ProfileDescriptionStep'),
    '/register/verificationemail': () => import('../pages/Register/EmailVerificationStep'),
    '/register/safety-tips': () => import('../pages/Register/SafetyTipsStep'),
};

interface HeaderIconButtonProps {
    onClick: () => void;
    ariaLabel: string;
    tooltip: string;
    align: 'left' | 'right';
    children: React.ReactNode;
    className?: string;
}

const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({ onClick, ariaLabel, tooltip, align, children, className = "" }) => {
    // Solo mostrar tooltip y aria-label en móvil, donde no hay texto visible
    const tooltipPositionClass = align === 'left' ? 'left-0' : 'right-0';
    return (
        <div className="relative inline-flex group">
            <button
                onClick={(e) => {
                    e.currentTarget.blur();
                    onClick();
                }}
                className={`
                    flex items-center justify-center text-[#3f4a9b]/70 transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none 
                    w-9 h-9 rounded-full md:w-auto md:h-auto md:rounded-full md:px-5 md:py-2
                    hover:bg-white/20 md:hover:bg-[#e6eaff] md:shadow-none md:hover:shadow-md
                    group
                    ${className}
                `}
                aria-label={ariaLabel}
            >
                {/* En móvil solo icono, aria-label y tooltip útiles; en md+ hay texto visible */}
                {children}
            </button>
            {/* Tooltip solo visible en móvil, oculto en md+ */}
            <span
                role="tooltip"
                aria-hidden="true"
                className={`pointer-events-none absolute ${tooltipPositionClass} top-full mt-2 origin-top z-20 rounded-lg border border-white/70 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-[#3f4a9b] shadow-md backdrop-blur-sm opacity-0 translate-y-1 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 md:hidden`}
            >
                {tooltip}
            </span>
        </div>
    );
};

export const RegisterLayout: React.FC = () => {
    useScrollToTop();
    const navigate = useNavigate();
    const location = useLocation(); 

    const steps = [
    '/register/name',
    '/register/age',
    '/register/gender',
    '/register/sexuality',
    '/register/neurodivergence',
    '/register/communication',
    '/register/email',
    '/register/photos',
    '/register/location',
    '/register/interests',
    '/register/description',
    '/register/verificationemail', 
    '/register/safety-tips'
];

    const currentStepIndex = steps.indexOf(location.pathname);
    const progressLevel = currentStepIndex !== -1 ? currentStepIndex + 1 : 0;
    const stepCounterLabel = progressLevel > 0 ? `${progressLevel}/${steps.length}` : null;
    const screenReaderStepLabel = progressLevel > 0 ? `Paso ${progressLevel} de ${steps.length}` : '';

    useEffect(() => {
        if (currentStepIndex < 0) {
            return;
        }

        const neighborPaths = [steps[currentStepIndex - 1], steps[currentStepIndex + 1]].filter(Boolean);
        const preloadNeighbors = () => {
            neighborPaths.forEach((path) => {
                const preload = REGISTER_STEP_PRELOADERS[path as string];
                if (preload) {
                    preload().catch(() => {
                        // Ignore prefetch errors; navigation still loads lazily on demand.
                    });
                }
            });
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            const idleId = (window as typeof window & {
                requestIdleCallback: (cb: IdleRequestCallback) => number;
                cancelIdleCallback: (id: number) => void;
            }).requestIdleCallback(() => preloadNeighbors());

            return () => {
                (window as typeof window & {
                    cancelIdleCallback: (id: number) => void;
                }).cancelIdleCallback(idleId);
            };
        }

        const timeoutId = setTimeout(preloadNeighbors, 120);
        return () => clearTimeout(timeoutId);
    }, [currentStepIndex, steps]);

    return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center font-sans overflow-hidden relative">
                
            {progressLevel > 0 && (
                <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-white/35 rounded-br-sm overflow-hidden z-50">
                    <div 
                        className="h-full bg-[#3f4a9b] rounded-r-sm transition-all duration-700 ease-out"
                        style={{ width: `${(progressLevel / steps.length) * 100}%` }}
                    />
                </div>
            )}

            <div className="w-full grid grid-cols-3 items-center px-4 py-4 md:px-8 md:py-6 [@media(max-height:1000px)]:pt-7 [@media(max-height:1000px)]:pb-3 [@media(max-height:760px)]:pt-5 [@media(max-height:760px)]:pb-2 z-10">
                <div className="justify-self-start -ml-2">
                    <HeaderIconButton
                        onClick={() => navigate(-1)}
                        ariaLabel="Volver atrás"
                        tooltip="Volver"
                        align="left"
                    >
                            <span className="hidden md:inline-flex items-center gap-2">
                                <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                <span>Atrás</span>
                            </span>
                        <span className="md:hidden">
                            <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        </span>
                    </HeaderIconButton>
                </div>

                {stepCounterLabel && (
                    <p className="justify-self-center rounded-full bg-white/65 px-4 py-1.5 text-xs md:text-sm font-bold tracking-wide text-[#3f4a9b] shadow-sm ring-1 ring-[#3f4a9b]/15">
                        {stepCounterLabel}
                    </p>
                )}

                <div className="justify-self-end">
                    <HeaderIconButton
                        onClick={() => navigate('/')}
                        ariaLabel="Ir al inicio"
                        tooltip="Inicio"
                        align="right"
                        className="w-11 h-11 md:w-12 md:h-12"
                    >
                            <span className="hidden md:inline-flex items-center gap-2">
                                <span>Inicio</span>
                                <Home size={21} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            </span>
                        <span className="md:hidden">
                            <Home size={21} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                        </span>
                    </HeaderIconButton>
                </div>
            </div>

            {progressLevel > 0 && (
                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    {screenReaderStepLabel}
                </p>
            )}


            <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center -mt-10 md:-mt-2 [@media(max-height:1000px)]:-mt-6 [@media(max-height:760px)]:-mt-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <div key={location.pathname} className="w-full h-full flex justify-center">
                        <Outlet />
                    </div>
                </AnimatePresence>
            </div>
        </main>
    );
};
