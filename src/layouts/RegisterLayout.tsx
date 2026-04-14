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
}

const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({ onClick, ariaLabel, tooltip, align, children }) => {
    const tooltipPositionClass = align === 'left' ? 'left-0' : 'right-0';

    return (
        <div className="relative inline-flex group">
            <button
                onClick={onClick}
                className="p-2 text-[#3f4a9b]/90 hover:text-[#3f4a9b] hover:bg-white/35 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f4a9b]/40"
                aria-label={ariaLabel}
            >
                {children}
            </button>
            <span
                role="tooltip"
                aria-hidden="true"
                className={`pointer-events-none absolute ${tooltipPositionClass} top-full mt-2 origin-top z-20 rounded-lg border border-white/70 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-[#3f4a9b] shadow-md backdrop-blur-sm opacity-0 translate-y-1 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100`}
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

            <div className="w-full grid grid-cols-3 items-center px-4 py-4 md:px-8 md:py-6 [@media(max-height:900px)]:py-3 [@media(max-height:760px)]:py-2.5 z-10">
                <div className="justify-self-start -ml-2">
                    <HeaderIconButton
                        onClick={() => navigate(-1)}
                        ariaLabel="Volver atras"
                        tooltip="Volver"
                        align="left"
                    >
                        <ChevronLeft size={28} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
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
                    >
                        <Home size={26} strokeWidth={2.5} className="group-hover:scale-[1.03] transition-transform" />
                    </HeaderIconButton>
                </div>
            </div>

            {progressLevel > 0 && (
                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    {screenReaderStepLabel}
                </p>
            )}


            <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center -mt-10 md:-mt-8 [@media(max-height:900px)]:-mt-6 [@media(max-height:760px)]:-mt-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <div key={location.pathname} className="w-full h-full flex justify-center">
                        <Outlet /> 
                    </div>
                </AnimatePresence>
            </div>
        </main>
    );
};