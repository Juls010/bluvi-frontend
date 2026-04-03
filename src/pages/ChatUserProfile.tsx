import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { User } from '../types/User.types';
import { SimpleCarousel } from '../components/SimpleCarousel';
import { Cake, User as UserIcon, MapPin, Heart, Sprout, Brain } from 'lucide-react';
import { 
    GENDER_LABELS,
    SEXUALITY_LABELS 
} from '../types/User.types';
import api from '../services/api';

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
                console.log('Profile response:', response.data);
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
            <div className="flex flex-col h-screen bg-white">
                <header className="flex-none py-4 px-6 border-b border-purple-100/60">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Volver"
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 text-bluvi-purple transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </header>
                <div className="flex-1 flex items-center justify-center text-bluvi-purple font-medium">Cargando perfil...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <header className="flex-none py-4 px-6 border-b border-purple-100/60">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Volver"
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 text-bluvi-purple transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </header>
                <div className="flex-1 flex items-center justify-center text-gray-500 font-medium">Usuario no encontrado</div>
            </div>
        );
    }

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

    const photosForCarousel = (user.photos && Array.isArray(user.photos) && user.photos.length > 0) 
        ? user.photos.filter((p): p is string => typeof p === 'string') 
        : [(user as any).main_photo || '/assets/images/default-avatar.png'];

    return (
        <div className="flex flex-col h-screen bg-transparent">
            {/* Header */}
            <header className="flex-none py-4 px-6 bg-white/80 backdrop-blur-md flex items-center justify-between mx-4 mt-2 rounded-3xl">
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Volver"
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 text-bluvi-purple transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                >
                    <ArrowLeft size={24} strokeWidth={2} />
                </button>
                <h1 className="text-lg font-semibold text-bluvi-purple">
                    {user.first_name} {user.last_name}
                </h1>
                <div className="w-10" />
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Photos Column */}
                        <div className="md:col-span-4">
                            <div className="sticky top-6">
                                <SimpleCarousel 
                                    photos={photosForCarousel}
                                    firstName={user.first_name}
                                />
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="md:col-span-8 space-y-4">
                            {/* Basic Info */}
                            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                                <ul className="flex flex-wrap gap-4 sm:gap-6 text-bluvi-purple font-semibold mb-4 text-sm md:text-base border-b border-bluvi-purple/10 pb-4">
                                    <li className="flex items-center gap-1.5">
                                        <Cake className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" />
                                        <span>{age} <span className="sr-only">años</span></span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <UserIcon className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" />
                                        <span className="sr-only">Género:</span>
                                        {genderLabel}
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" />
                                        <span className="sr-only">Ubicación:</span>
                                        {user.city}
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" />
                                        <span className="sr-only">Orientación sexual:</span>
                                        {sexualityLabel}
                                    </li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    {user.description || 'Sin descripción'}
                                </p>
                            </div>

                            {/* Interests */}
                            {interestLabels.length > 0 && (
                                <section className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Sprout className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" /> Intereses
                                    </h2>
                                    <ul className="flex flex-wrap gap-2">
                                        {interestLabels.map((label) => (
                                            <li key={label} className="px-3 py-1.5 bg-bluvi-purple/5 border border-bluvi-purple/10 rounded-lg text-sm font-medium text-bluvi-purple">
                                                {label}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Mind & Communication */}
                            {(traitLabels.length > 0 || communicationLabels.length > 0) && (
                                <section className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-bluvi-purple/60" aria-hidden="true" /> Mente y Comunicación
                                    </h2>
                                    {traitLabels.length > 0 && (
                                        <div className="mb-5">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase block mb-2">Rasgos</h3>
                                            <ul className="flex flex-wrap gap-2">
                                                {traitLabels.map((label) => (
                                                    <li key={label} className="px-3 py-1.5 bg-bluvi-purple/5 text-bluvi-purple border border-bluvi-purple/10 rounded-lg text-sm font-medium">
                                                        {label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {communicationLabels.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase block mb-2">Comunicación</h3>
                                            <ul className="flex flex-wrap gap-2">
                                                {communicationLabels.map((label, index) => (
                                                    <li 
                                                        key={`${label}-${index}`}
                                                        className="px-3 py-1.5 bg-bluvi-purple/5 text-bluvi-purple border border-bluvi-purple/10 rounded-lg text-sm font-medium"
                                                    >
                                                        {label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
