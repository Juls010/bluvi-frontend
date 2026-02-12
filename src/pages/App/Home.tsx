import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

// Tarjetas de perfil de muestra — en producción vendrían de la API
const SAMPLE_PROFILES = [
    {
        id: 1,
        name: 'Lucila, 26',
        tag: 'TDAH · Fotografía',
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop',
        rotate: '-rotate-3',
        z: 'z-10',
    },
    {
        id: 2,
        name: 'Marcos, 29',
        tag: 'Autismo · Música',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
        rotate: 'rotate-2',
        z: 'z-20',
    },
    {
        id: 3,
        name: 'Alba, 24',
        tag: 'Dislexia · Arte',
        img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop',
        rotate: '-rotate-1',
        z: 'z-30',
    },
];

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col gap-7">
            <div className="flex justify-center animate-fade-in motion-reduce:animate-none">
                <img
                    src={logo}
                    alt="Bluvi — Tu espacio seguro para conectar"
                    role="img"
                    className="w-70 md:w-130 h-auto object-contain drop-shadow-md"
                />
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <div className="flex flex-col items-start text-left animate-fade-in motion-reduce:animate-none">

                    <span
                        aria-hidden="true"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-bluvi-purple/60 bg-bluvi-light-purple/30 px-3 py-1.5 rounded-full mb-5 select-none"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-bluvi-purple/40 inline-block" />
                        Tu espacio seguro
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-bluvi-purple leading-[1.1] mb-5 tracking-tight">
                        Conexiones{' '}
                        <span
                            aria-hidden="true"
                            className="relative inline-block"
                            style={{
                                backgroundImage: 'linear-gradient(135deg, #3f4292, #b8bceb)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            que encajan
                        </span>
                        <span className="sr-only">que encajan</span>
                    </h1>

                    <p className="text-bluvi-purple/70 text-base leading-relaxed mb-10 max-w-sm font-medium">
                        Encuentra personas que vibran en tu misma frecuencia.
                        Un lugar donde ser tú no necesita explicación.
                    </p>

                    <nav aria-label="Acciones principales" className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/app/discovery')}
                            aria-label="Explorar perfiles de personas compatibles"
                            className="px-8 py-3.5 rounded-2xl text-white font-semibold text-base shadow-lg transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/50 focus-visible:ring-offset-2"
                            style={{ background: 'linear-gradient(135deg, #3f4292, #6366c7)' }}
                        >
                            Explorar perfiles
                        </button>
                        <button
                            onClick={() => navigate('/app/matches')}
                            aria-label="Ver mis matches actuales"
                            className="px-8 py-3.5 rounded-2xl text-bluvi-purple font-semibold text-base bg-white/60 border border-bluvi-light-purple/50 backdrop-blur-sm transition-colors duration-300 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/30 focus-visible:ring-offset-2"
                        >
                            Mis matches
                        </button>
                    </nav>

                    <dl
                        aria-label="Estadísticas de la comunidad Bluvi"
                        className="flex gap-6 mt-10 pt-8 border-t border-bluvi-light-purple/30 w-full"
                    >
                        {[
                            { value: '2.4k', label: 'Personas activas' },
                            { value: '94%', label: 'Se sienten seguros' },
                            { value: '18+',  label: 'Neurodivergencias' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <dt className="text-[11px] text-bluvi-purple/50 font-medium mt-0.5 order-2">
                                    {stat.label}
                                </dt>
                                <dd className="text-xl font-bold text-bluvi-purple order-1">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div
                    aria-hidden="true"
                    className="relative h-[420px] hidden md:flex items-center justify-center animate-fade-in motion-reduce:animate-none"
                >
                    {SAMPLE_PROFILES.map((profile, i) => (
                        <div
                            key={profile.id}
                            className={`
                                absolute w-52 rounded-3xl overflow-hidden shadow-xl
                                ${profile.rotate} ${profile.z}
                            `}
                            style={{
                                left: `${15 + i * 22}%`,
                                top:  `${8  + i * 6}%`,
                                animation: 'cardFloat 6s ease-in-out infinite',
                                animationDelay: `${i * 1.8}s`,
                            }}
                        >
                            <img
                                src={profile.img}
                                alt=""              
                                className="w-full h-64 object-cover"
                                loading="lazy"
                            />
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-3">
                                <p className="text-[13px] font-bold text-bluvi-purple leading-tight">{profile.name}</p>
                                <p className="text-[11px] text-bluvi-purple/50 font-medium mt-0.5">{profile.tag}</p>
                            </div>
                        </div>
                    ))}

                    <div
                        className="absolute w-72 h-72 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(184,188,235,0.25) 0%, transparent 70%)',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>

            </div>

            <style>{`
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0px);  }
                    50%       { transform: translateY(-8px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    @keyframes cardFloat {
                        0%, 100% { transform: translateY(0px); }
                    }
                }
            `}</style>
        </div>
    );
};