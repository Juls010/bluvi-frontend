import React from 'react';
import { type User } from '../data/mockUsers';
import { SimpleCarousel } from './SimpleCarousel';
import ClickSpark from './ClickSpark';

interface ProfileDetailProps {
    user: User;
    onClose: () => void;
    onLike: () => void;
    onPass: () => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ user, onClose, onLike, onPass }) => {

    const carouselPhotos = user.photos && user.photos.length > 0 
        ? user.photos.map((url, index) => ({
            id: index,
            image: url,
            alt: `Foto ${index + 1} de ${user.name}`
        }))
        : [ 
            { id: 0, image: user.image, alt: `Foto de perfil de ${user.name}` }
        ];

    return (
        <article className="w-full max-w-5xl mx-auto p-4 md:p-0 animate-fade-in motion-reduce:animate-none">
        
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-bluvi-purple mb-6 pl-2 outline-none" tabIndex={-1}>
            {user.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="md:col-span-4 flex flex-col gap-6">
                
                <div className="w-full"> 
                    <SimpleCarousel photos={carouselPhotos} />
                </div>

                <div className="flex justify-between px-4">
                    <button 
                        onClick={onPass}
                        aria-label={`Pasar perfil de ${user.name}`}
                        className="w-16 h-16 rounded-2xl border-2 border-bluvi-purple/30 text-bluvi-purple hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center focus:ring-4 focus:ring-red-200 outline-none"
                    >
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <button 
                            onClick={onLike}
                            aria-label={`Me gusta ${user.name}`}
                            className="w-16 h-16 relative overflow-visible rounded-2xl bg-bluvi-purple text-white shadow-lg hover:scale-105 hover:bg-bluvi-purple/90 transition-all flex items-center justify-center focus:ring-4 focus:ring-purple-300 outline-none"
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
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                    <ul className="flex flex-wrap gap-4 sm:gap-6 text-bluvi-purple font-semibold mb-4 text-sm md:text-base border-b border-bluvi-purple/10 pb-4">
                        <li className="flex items-center gap-1">
                            <span aria-hidden="true">🎂</span>
                            <span>{user.age} <span className="sr-only">años</span></span>
                        </li>

                        <li className="flex items-center gap-1">
                            <span aria-hidden="true">👤</span>
                            <span className="sr-only">Género:</span>
                            {user.gender}
                        </li>
                        <li className="flex items-center gap-1">
                            <span aria-hidden="true">📍</span>
                            <span className="sr-only">Ubicación:</span>
                            {user.location}
                        </li>
                        <li className="flex items-center gap-1">
                            <span aria-hidden="true">🌈</span>
                            <span className="sr-only">Orientación sexual:</span>
                            {user.orientation}
                        </li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {user.bio}
                    </p>
                </div>

                <section className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <span aria-hidden="true">🌱</span> Mis intereses
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                        {user.interests.map((tag) => (
                            <li key={tag} className="px-4 py-2 bg-gray-200 text-bluvi-purple border border-gray-200 rounded-xl text-sm font-medium">
                                {tag}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span aria-hidden="true">🧠</span> Mente y Comunicación
                    </h2>
                    <div className="mb-5">
                        <h3 className="text-xs font-bold text-gray-400 uppercase block mb-2">Rasgos</h3>
                        <ul className="flex flex-wrap gap-2">
                            {user.divergentTraits.map((trait) => (
                                <li key={trait} className="px-4 py-2 bg-gray-200 text-bluvi-purple border border-purple-100 rounded-xl text-sm font-semibold">
                                    {trait}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase block mb-2">Comunicación</h3>
                        <ul className="flex flex-wrap gap-2">
                            {user.communicationStyle.map((style) => (
                                <li key={style} className="px-4 py-2 bg-gray-200 text-bluvi-purple border border-blue-100 rounded-xl text-sm font-semibold">
                                    {style}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <div className="flex justify-end mt-2">
                    <button className="text-xs font-medium text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-red-200 outline-none">
                        Denunciar y bloquear usuario
                    </button>
                </div>

            </div>
        </div>
        </article>
    );
};