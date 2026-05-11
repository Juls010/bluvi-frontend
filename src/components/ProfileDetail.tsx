import React from 'react';
import type { User } from '../types/User.types';
import { SimpleCarousel } from './SimpleCarousel';
import ClickSpark from './ClickSpark';
import { Cake, User as UserIcon, MapPin, Heart, Sprout, Brain, X } from 'lucide-react';
import { 
    GENDER_LABELS,
    SEXUALITY_LABELS 
} from '../types/User.types';
import { Tooltip, TooltipTrigger, Button as AriaButton } from './Tooltip';
import { VerifiedIdentityIcon } from './VerifiedIdentityIcon';
interface ProfileDetailProps {
    user: User;
    onClose: () => void;
    onLike: () => void;
    onPass: () => void;
    onReportAndBlock?: () => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ user, onLike, onPass, onReportAndBlock }) => {

    const age = (user as any).birth_date 
    ? Math.floor((Date.now() - new Date((user as any).birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : '—';
    const genderLabel = GENDER_LABELS[user.id_gender] || 'No especificado';

    const preferenceId = (user as any).id_preference;
    const sexualityLabel = SEXUALITY_LABELS[preferenceId] || 'No especificada';

    const communicationLabels: string[] = Array.isArray(user.communication_style) 
    ? (user.communication_style as string[]) 
    : [];

    const traitLabels = Array.isArray(user.features) ? user.features : [];

    const interestLabels = Array.isArray(user.interests) ? user.interests : [];

    const photosForCarousel = (user.photos?.length && user.photos[0]) 
        ? user.photos.filter((p): p is string => typeof p === 'string') 
        : [(user as any).main_photo || '/assets/images/default-avatar.png'];

    return (
        <article className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-0 pb-32 md:pb-0 animate-fade-in motion-reduce:animate-none text-app-primary">
        
        <div className="mb-4 md:mb-8 pl-1 md:pl-2 flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-app-primary outline-none" tabIndex={-1}>
                {user.first_name} {user.last_name}
            </h1>
            {user.is_face_verified && (
                <VerifiedIdentityIcon iconClassName="h-6 w-6 md:h-7 md:w-7" />
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                
                <div className="w-full max-h-[450px] flex justify-center"> 
                    <SimpleCarousel 
                    photos={photosForCarousel}
                    firstName={user.first_name} />
                </div>

                {/* Botones para Escritorio */}
                <div className="hidden md:flex justify-center gap-36 px-4 mt-2">
                    <TooltipTrigger delay={600}>
                        <AriaButton 
                            onPress={onPass}
                            aria-label={`Pasar perfil de ${user.first_name}`}
                            className="w-16 h-16 rounded-[22px] border-2 border-app-soft/30 bg-app-surface-soft text-app-muted hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                        >
                            <X size={32} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                        </AriaButton>
                        <Tooltip>Pasar</Tooltip>
                    </TooltipTrigger>

                    <TooltipTrigger delay={600}>
                        <AriaButton 
                            onPress={onLike}
                            aria-label={`Me gusta ${user.first_name}`}
                            className="w-16 h-16 relative overflow-visible rounded-[22px] text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center active:scale-95 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400/30"
                            style={{ backgroundColor: '#d3435dff' }}
                        >
                            <ClickSpark 
                                sparkColor="#ffffff" 
                                sparkCount={10} 
                                sparkRadius={35} 
                                sparkSize={12}
                                duration={500}
                                extraScale={1.5} 
                                className="w-full h-full flex items-center justify-center"
                            >
                                <Heart size={32} fill="currentColor" className="transition-transform group-hover:scale-110" />
                            </ClickSpark>
                        </AriaButton>
                        <Tooltip>Me gusta</Tooltip>
                    </TooltipTrigger>
                </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
                <div className="bg-app-surface backdrop-blur-md p-6 rounded-3xl border border-app-soft shadow-sm">
                    <ul className="flex flex-wrap gap-4 sm:gap-6 text-app-primary font-semibold mb-4 text-sm md:text-base border-b border-app-strong pb-4">
                        <li className="flex items-center gap-1.5">
                            <Cake className="w-4 h-4 text-app-accent" aria-hidden="true" />
                            <span>{age} <span className="sr-only">años</span></span>
                        </li>

                        <li className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4 text-app-accent" aria-hidden="true" />
                            <span className="sr-only">Género:</span>
                            {genderLabel}
                        </li>
                        <li className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-app-accent" aria-hidden="true" />
                            <span className="sr-only">Ubicación:</span>
                            {user.city}
                        </li>
                        <li className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4 text-app-accent" aria-hidden="true" />
                            <span className="sr-only">Orientación sexual:</span>
                            {sexualityLabel}
                        </li>
                    </ul>
                    <p className="text-app-secondary leading-relaxed text-lg">
                        {user.description}
                    </p>
                </div>

                <section className="bg-app-surface backdrop-blur-md p-6 rounded-3xl border border-app-soft shadow-sm">
                    <h2 className="text-sm font-bold text-app-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-app-accent" aria-hidden="true" /> Mis intereses
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                        {interestLabels.map((label) => (
                            <li key={label} className="px-3 py-1.5 bg-app-pill border border-app-soft rounded-lg text-sm font-medium text-app-primary">
                                {label}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="bg-app-surface-strong backdrop-blur-md p-6 rounded-3xl border border-app-soft shadow-sm">
                    <h2 className="text-sm font-bold text-app-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Brain className="w-4 h-4 text-app-accent" aria-hidden="true" /> Mente y Comunicación
                    </h2>
                    <div className="mb-5">
                        <h3 className="text-xs font-bold text-app-muted uppercase block mb-2">Rasgos</h3>
                        <ul className="flex flex-wrap gap-2">
                            {traitLabels.map((label) => (
                                <li key={label} className="px-3 py-1.5 bg-app-pill text-app-primary border border-app-soft rounded-lg text-sm font-medium">
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-app-muted uppercase block mb-2">Comunicación</h3>
                        <ul className="flex flex-wrap gap-2">
                            {communicationLabels.length > 0 ? (
                                communicationLabels.map((label, index) => (
                                    <li 
                                        key={`${label}-${index}`} // Usamos el index por si hay labels repetidos
                                        className="px-3 py-1.5 bg-app-pill text-app-primary border border-app-soft rounded-lg text-sm font-medium"
                                    >
                                        {label}
                                    </li>
                                ))
                            ) : (
                                <li className="text-app-muted text-sm italic">No hay estilos definidos</li>
                            )}
                        </ul>
                    </div>
                </section>
                <div className="flex justify-end mt-1">
                    <button 
                        onClick={onReportAndBlock}
                        className="text-xs font-medium text-app-secondary hover:text-red-600 bg-app-surface-soft hover:bg-red-50 px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-red-200 outline-none"
                    >
                        Denunciar y bloquear usuario
                    </button>
                </div>
            </div>
        </div>

        <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-50 pointer-events-none">
            <div className="bg-app-surface/85 backdrop-blur-2xl shadow-xl rounded-[40px] py-3 px-10 flex justify-between items-center pointer-events-auto">
                <AriaButton 
                    onPress={onPass}
                    aria-label={`Pasar perfil de ${user.first_name}`}
                    className="w-16 h-16 rounded-[28px] border-2 border-app-soft/30 bg-app-surface-soft text-app-muted hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                >
                    <X size={32} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
                </AriaButton>

                <AriaButton 
                    onPress={onLike}
                    aria-label={`Me gusta ${user.first_name}`}
                    className="w-16 h-16 relative overflow-visible rounded-[28px] text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center active:scale-95 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400/30"
                    style={{ backgroundColor: '#d3435dff' }}
                >
                    <ClickSpark 
                        sparkColor="#ffffff" 
                        sparkCount={10} 
                        sparkRadius={35} 
                        sparkSize={12}
                        duration={500}
                        extraScale={1.5} 
                        className="w-full h-full flex items-center justify-center"
                    >
                        <Heart size={32} fill="currentColor" className="transition-transform group-hover:scale-110" />
                    </ClickSpark>
                </AriaButton>
            </div>
        </div>
    </article>
    );
};
