import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import logo from '../../assets/logo.svg';
import { ArrowRight, Zap, Leaf, BookOpenText, Sparkles } from 'lucide-react';
import { Footer } from '../../components/Footer';

const PILLS = ['TDAH', 'Autismo · TEA', 'Dislexia', 'Disfasia', 'Altas capacidades', '+ 13 más'] as const;

const STATS = [
    { value: '2.4k', label: 'Personas activas' },
    { value: '94%', label: 'Se sienten seguros' },
    { value: '18+', label: 'Neurotipos' },
] as const;

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

const NEURO_TYPES = [
    { label: 'TDAH', desc: 'Energía diferente, creatividad desbordante y una forma única de conectar ideas.', bg: 'bg-violet-50', icon: <Zap size={24} strokeWidth={2.5} className="text-violet-600" /> },
    { label: 'Autismo · TEA', desc: 'Sensibilidades intensas, lealtad profunda y visiones del mundo extraordinarias.', bg: 'bg-emerald-50', icon: <Leaf size={24} strokeWidth={2.5} className="text-emerald-600" /> },
    { label: 'Dislexia', desc: 'Pensamiento visual y narrativo que va mucho más allá de las palabras en papel.', bg: 'bg-pink-100', icon: <BookOpenText size={24} strokeWidth={2.5} className="text-pink-600" /> },
    { label: 'Altas capacidades', desc: 'Curiosidad sin límites y una profundidad emocional e intelectual que pocos entienden.', bg: 'bg-amber-50', icon: <Sparkles /> },
];

const STEPS = [
    { n: 1, title: 'Crea tu perfil', desc: 'Cuéntanos quién eres: tus intereses, tu neurotipo (si quieres), cómo prefieres comunicarte.' },
    { n: 2, title: 'Descubre personas afines', desc: 'Nuestro sistema de afinidad conecta por intereses, estilo de comunicación y valores.' },
    { n: 3, title: 'Chatea a tu ritmo', desc: 'Sin presión de responder en segundos. Los mensajes esperan. Tómate tu tiempo.' },
    { n: 4, title: 'Queda cuando estés listo', desc: 'Propón un plan, sugiere un café o simplemente sigue conociéndoos. Sin guiones.' },
];



export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    useScrollToTop();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/app/home', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    React.useEffect(() => {
        const observerOptions = {
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect(); 
        }, []);

    return (
        <div className="bg-transparent w-full overflow-x-hidden font-sans">
            <div className="w-full flex justify-center mb-6 md:mb-5 pt-6 reveal">
                <img 
                    src={logo} 
                    alt="Bluvi" 
                    className="w-70 md:w-[480px] lg:w-[550px] h-auto drop-shadow-lg" 
                />
            </div>

            <AnimatedStep className="flex-col md:flex-row items-center justify-center gap-16 max-w-6xl px-6 py-10 min-h-[90vh] mx-auto">
                
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                    
                    <h1 className="text-[clamp(32px,5vw,48px)] font-bold text-[#26215C] leading-[1.1] mb-2 tracking-tight">
                        Conectar es simple, <br />
                        <span className="text-[#7F77DD] ">siendo tú mismo.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[#3d3867] leading-relaxed max-w-md mb-2 font-medium">
                        Una comunidad de citas para personas neurodivergentes. Sin prejuicios, sin máscaras. Solo tú.
                    </p>

                    <ul className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 list-none">
                        {PILLS.map((pill) => (
                            <li key={pill} className="bg-white/60 backdrop-blur-sm border border-[#C4C0F0] text-[#534AB7] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                {pill}
                            </li>
                        ))}
                    </ul>

                    <dl className="flex gap-8 py-6 border-t border-[#C4C0F0]/40 mb-4 w-full justify-center md:justify-start">
                        {STATS.map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <dd className="text-2xl font-bold text-[#3C3489] leading-none">{s.value}</dd>
                                <dt className="text-[10px] uppercase tracking-[0.15em] text-[#7F77DD] font-black mt-1">{s.label}</dt>
                            </div>
                        ))}
                    </dl>

                    <nav className="flex flex-col gap-4 w-full max-w-sm">
                        <Button 
                            onClick={() => navigate('/register/name')}
                            className="flex items-center justify-center gap-2 bg-[#7F77DD] hover:bg-[#534AB7] text-white font-bold text-lg rounded-2xl px-8 py-4 shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5"
                        >
                            Empezar ahora <ArrowRight className="w-5 h-5" />
                        </Button>

                        <Button 
                            onClick={() => navigate('/login')}
                            className="flex items-center justify-center bg-white hover:bg-[#f5f3ff] !text-[#534AB7] font-bold text-lg border-2 border-[#C4C0F0] rounded-2xl px-8 py-4 transition-all"
                        >
                            Ya tengo cuenta
                        </Button>
                        
                        <p className="text-[11px] text-[#534AB7]/60 leading-relaxed mt-2">
                            Al continuar aceptas cuidar este espacio con respeto.
                        </p>
                    </nav>
                </div>

                <div className="flex-1 hidden md:flex relative h-[550px] w-full items-center justify-center">
                    {SAMPLE_PROFILES.map((profile, i) => (
                        <div
                            key={profile.id}
                            className={`absolute w-52 rounded-3xl overflow-hidden shadow-2xl ${profile.rotate} ${profile.z}`}
                            style={{
                                left: `${15 + i * 22}%`,
                                top: `${8 + i * 6}%`,
                                animation: 'cardFloat 6s ease-in-out infinite',
                                animationDelay: `${i * 1.8}s`,
                            }}
                        >
                            <img src={profile.img} alt="" className="w-full h-64 object-cover" />
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-3">
                                <p className="text-[13px] font-bold text-bluvi-purple">{profile.name}</p>
                                <p className="text-[11px] text-bluvi-purple/50 font-medium">{profile.tag}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedStep>

            <main id="main-content" className="w-full mt-10">
    
            <section className="w-full bg-white/30 py-24 border-t border-white/90">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="font-heading text-[11px] uppercase tracking-[0.2em] font-black text-[#7F77DD] mb-4 block">
                        Neurodiversidad
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#26215C] mb-10 leading-tight">
                        Tu cerebro funciona diferente.<br/>Eso no es un defecto.
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-[#C4C0F0]/40 border-t pt-10">
                        {NEURO_TYPES.map((n, i) => (
                            <div key={n.label} className="flex flex-col items-start group bg-white/30 border border-[#C4C0F0]/40 rounded-2xl p-6 reveal" style={{ transitionDelay: `${i * 150}ms` }}>
                                <div className={`w-12 h-12 rounded-2xl ${n.bg} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                                    {n.icon}
                                </div>
                                <h3 className="font-heading font-bold text-[#26215C] mb-2">{n.label}</h3>
                                <p className="font-sans text-sm text-[#3d3867] leading-relaxed opacity-80">{n.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full py-32 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    
                    <div className="text-center md:text-left max-w-2xl mb-20">
                        <h2 className="font-heading text-4xl font-bold text-[#26215C] mb-4 tracking-tight">
                            Tan sencillo como debe ser.
                        </h2>
                        <p className="font-sans text-lg text-[#3d3867] font-medium opacity-70">
                            Diseñado para evitar la sobrecarga sensorial y social.
                        </p>
                    </div>
                    
                    <div className="relative">
                        <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-[#7F77DD]/5 via-[#7F77DD]/20 to-[#7F77DD]/5" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                            {STEPS.map((s, i) => (
                                <div key={s.n} className="relative flex flex-col items-start group reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                                    
                                    <div className="relative z-10 flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-white border-4 border-[#F8F9FF] shadow-md">
                                        <span className="font-heading text-2xl font-black text-[#7F77DD]">
                                            {s.n}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-heading font-bold text-[#26215C] text-xl mb-3 tracking-tight">
                                            {s.title}
                                        </h3>
                                        <p className="font-sans text-[15px] text-[#3d3867] leading-relaxed opacity-80 max-w-[240px]">
                                            {s.desc}
                                        </p>
                                    </div>

                                    {i !== STEPS.length - 1 && (
                                        <div className="lg:hidden absolute left-10 top-20 w-0.5 h-12 bg-[#7F77DD]/10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <Footer />

            <style>{`
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }

                .reveal {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1);
                    will-change: opacity, transform;
                }

                .reveal.active {
                    opacity: 1;
                    transform: translateY(0px);
                }
            `}</style>
        </div>

        
    );
};
