import React, { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams } from 'react-router-dom';
import { ArrowLeftIcon,
    CakeIcon,
    UserIcon,
    MapPinIcon,
    HeartIcon,
    PlantIcon,
    BrainIcon,
    ChatCircleIcon
} from '@phosphor-icons/react';
import type { User } from '../types/User.types';
import { SimpleCarousel } from '../components/SimpleCarousel';
import { 
    GENDER_LABELS,
    SEXUALITY_LABELS 
} from '../types/User.types';
import api from '../services/api';
import { VerifiedIdentityIcon } from '../components/VerifiedIdentityIcon';
import { Tooltip, TooltipTrigger, Button as AriaButton } from '../components/Tooltip';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-app-surface backdrop-blur-md p-6 rounded-3xl border border-app-soft shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <h2 className="text-[12px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
    <span className="flex items-center gap-1.5">
      <span className="text-app-accent dark:text-app-orange">{icon}</span>
      {label}
    </span>
  </h2>
);

export const ChatUserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/users/${userId}`);
                if (response.data.success && response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error cargando perfil de usuario:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [userId]);

    if (loading) {
        return (
            <div className="w-full max-w-5xl mx-auto p-4 pb-28 pt-2 md:px-0 md:pb-0 md:pt-20 animate-pulse">
                <div className="h-10 w-48 bg-app-surface-soft rounded-xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4"><div className="aspect-[4/5] rounded-3xl bg-app-surface-soft" /></div>
                    <div className="md:col-span-8 space-y-4">
                        <div className="h-48 rounded-3xl bg-app-surface-soft" />
                        <div className="h-32 rounded-3xl bg-app-surface-soft" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="w-20 h-20 bg-app-surface-soft rounded-full flex items-center justify-center mb-4">
                    <UserIcon size={32} weight="bold" className="text-app-muted" />
                </div>
                <h2 className="text-xl font-bold text-app-primary mb-2">Usuario no encontrado</h2>
                <p className="text-app-secondary mb-6 max-w-xs">El perfil que buscas no existe o no tienes los permisos necesarios para verlo.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-app-accent text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-app-accent/20"
                >
                    Volver atrás
                </button>
            </div>
        );
    }

    const age = (user as any).birth_date 
        ? Math.floor((Date.now() - new Date((user as any).birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : '—';
    const genderLabel = GENDER_LABELS[user.id_gender] || 'No especificado';
    const preferenceId = (user as any).id_preference;
    const sexualityLabel = SEXUALITY_LABELS[preferenceId] || 'No especificada';

    const communicationStyle = Array.isArray(user.communication_style) ? user.communication_style : [];
    const features = Array.isArray(user.features) ? user.features : [];
    const interestNames = Array.isArray(user.interests) ? user.interests : [];

    const photosForCarousel = (user.photos && Array.isArray(user.photos) && user.photos.length > 0) 
        ? user.photos.filter((p): p is string => typeof p === 'string') 
        : [user.main_photo || '/assets/images/default-avatar.png'];

    return (
        <article className="w-full max-w-5xl mx-auto p-4 pb-28 pt-2 md:px-0 md:pb-0 md:pt-10 animate-fade-in motion-reduce:animate-none">
            {/* Header */}
            <div className="mb-6 flex flex-col items-start gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full min-w-0 items-start gap-3 sm:w-auto sm:items-center">
                    <TooltipTrigger delay={300}>
                        <AriaButton
                            onPress={() => navigate(-1)}
                            aria-label="Volver a mensajes"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-app-soft bg-app-surface-strong text-app-accent-strong shadow-sm transition-all hover:-translate-y-0.5 hover:border-app-accent/35 hover:bg-app-surface hover:text-app-accent hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/25"
                        >
                            <ArrowLeftIcon size={19} weight="bold" />
                        </AriaButton>
                        <Tooltip>Volver a mensajes</Tooltip>
                    </TooltipTrigger>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
                        <h1 className="min-w-0 text-2xl font-heading font-bold leading-tight text-app-primary md:text-4xl">
                            {user.first_name} {user.last_name}
                        </h1>
                        {user.is_face_verified && (
                            <VerifiedIdentityIcon />
                        )}
                    </div>
                </div>

                {user.can_chat ? (
                    <button
                        onClick={() => navigate(`/app/chat/${user.id_user}`)}
                        className="self-end flex items-center gap-2 rounded-2xl bg-app-accent px-4 py-2.5 text-sm font-bold text-app-on-accent shadow-xl transition-all hover:scale-105 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/30 sm:self-auto sm:px-6 sm:py-3"
                    >
                        <ChatCircleIcon size={18} weight="bold" className="transition-transform group-hover:rotate-12" />
                        <span>Ir al chat</span>
                    </button>
                ) : (
                    <span className="self-end rounded-2xl border border-app-soft bg-app-surface-soft px-4 py-2 text-sm font-bold text-app-secondary sm:self-auto">
                        Solicitud pendiente
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Carousel Column */}
                <aside className="md:col-span-4 lg:col-span-4 w-full">
                    <div className="sticky top-6">
                        <SimpleCarousel photos={photosForCarousel} firstName={user.first_name} />
                    </div>
                </aside>

                {/* InfoIcon Column */}
                <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-6">
                    <Card>
                        <ul className="flex flex-wrap gap-4 sm:gap-6 text-app-primary font-semibold mb-4 text-sm border-b border-app-soft pb-4">
                            <li className="flex items-center gap-2">
                                <CakeIcon className="w-4 h-4 text-app-accent dark:text-app-orange" weight="bold" /> {age} años
                            </li>
                            <li className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-app-accent dark:text-app-orange" weight="bold" /> {genderLabel}
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4 text-app-accent dark:text-app-orange" weight="bold" /> {user.city}
                            </li>
                            <li className="flex items-center gap-2">
                                <HeartIcon className="w-4 h-4 text-app-accent dark:text-app-orange" weight="bold" /> {sexualityLabel}
                            </li>
                        </ul>
                        <p className="text-app-secondary leading-relaxed text-lg">{user.description || 'Sin descripción'}</p>
                    </Card>

                    {interestNames.length > 0 && (
                        <Card>
                            <div className="mb-6">
                                <SectionLabel icon={<PlantIcon className="w-4.5 h-4.5" weight="bold" />} label="Intereses" />
                            </div>
                            <ul className="flex flex-wrap gap-2">
                                {interestNames.map((name: string) => (
                                    <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {(features.length > 0 || communicationStyle.length > 0) && (
                        <Card>
                            <div className="mb-6">
                                <SectionLabel icon={<BrainIcon className="w-4.5 h-4.5" weight="bold" />} label="Mente y Comunicación" />
                            </div>

                            <div className="space-y-6">
                                {features.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3">
                                            Rasgos distintivos
                                        </h3>
                                        <ul className="flex flex-wrap gap-2">
                                            {features.map((name: string) => (
                                                <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                                                    {name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {communicationStyle.length > 0 && (
                                    <div className="pt-6 border-t border-app-soft">
                                        <h3 className="text-[10px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3">
                                            Estilo comunicativo
                                        </h3>
                                        <ul className="flex flex-wrap gap-2">
                                            {communicationStyle.map((name: string) => (
                                                <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                                                    {name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </article>
    );
};
