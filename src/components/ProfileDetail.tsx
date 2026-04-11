import React from 'react';
import type { User } from '../types/User.types';
import { SimpleCarousel } from './SimpleCarousel';
import ClickSpark from './ClickSpark';
import { Cake, User as UserIcon, MapPin, Heart, Sprout, Brain } from 'lucide-react';
import { 
    GENDER_LABELS,
    SEXUALITY_LABELS 
} from '../types/User.types';
interface ProfileDetailProps {
    user: User;
    onClose: () => void;
    onLike: () => void;
    onPass: () => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ user, onClose, onLike, onPass }) => {
    console.log("🔍 INVESTIGANDO USUARIO:", user);

   
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
        <article className="w-full max-w-5xl mx-auto p-4 md:p-0 animate-fade-in motion-reduce:animate-none text-app-primary">
        
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-app-primary mb-6 pl-2 outline-none" tabIndex={-1}>
            {user.first_name} {user.last_name}
        </h1>
        <div className="flex justify-end mb-4 px-2">
            <button
                onClick={onClose}
                className="text-xs font-medium text-app-secondary hover:text-app-primary bg-app-surface-soft px-3 py-1.5 rounded-lg transition-colors"
            >
                Cerrar perfil
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="md:col-span-4 flex flex-col gap-6">
                
                <div className="w-full"> 
                    <SimpleCarousel 
                    photos={photosForCarousel}
                    firstName={user.first_name} />
                </div>

                <div className="flex justify-between px-4">
                    <button 
                        onClick={onPass}
                        aria-label={`Pasar perfil de ${user.first_name}`}
                        className="w-16 h-16 rounded-2xl border-2 border-app-strong text-app-accent hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center focus:ring-4 focus:ring-red-200 outline-none"
                    >
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <button 
                            onClick={onLike}
                            aria-label={`Me gusta ${user.first_name}`}
                            className="w-16 h-16 relative overflow-visible rounded-2xl text-app-on-accent shadow-md hover:scale-[1.03] hover:brightness-105 transition-all flex items-center justify-center focus:ring-4 focus:ring-purple-300 outline-none"
                            style={{ backgroundColor: 'var(--app-accent)' }}
                        >
                            <ClickSpark 
                                sparkColor="#ffffff" 
                                sparkCount={8} 
                                sparkRadius={30} 
                                sparkSize={15}
                                duration={400}
                                extraScale={1.2} 
                                className="w-full h-full flex items-center justify-center"
                            >
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                            </ClickSpark>
                        </button>
                </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-4">
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
                <div className="flex justify-end mt-2">
                    <button className="text-xs font-medium text-app-secondary hover:text-red-600 bg-app-surface-soft hover:bg-red-50 px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-red-200 outline-none">
                        Denunciar y bloquear usuario
                    </button>
                </div>

            </div>
        </div>
        </article>
    );
};