import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
    ArrowRight,
    HeartHandshake,
    Moon,
    Sun,
} from 'lucide-react';

import { Footer } from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import logo from '../../assets/logo.svg';

const NAV_LINKS = [
    { href: '#conexiones', label: 'Conexiones reales' },
    { href: '#idea', label: 'Información' },
    { href: '#cuidado', label: 'Seguridad' },
    { href: '#como-funciona', label: 'Ayuda' },
] as const;

const COUPLE_CARDS = [
    {
        id: 1,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425533/yurii-papushoi-ZRQOdFY01Xw-unsplash_pemdri.jpg',
        alt: 'Pareja sonriendo en un momento tranquilo',
    },
    {
        id: 2,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425510/marina-abrosimova-o9zs0vptb_8-unsplash_dwznlj.jpg',
        alt: 'Dos personas compartiendo una conversación cercana',
    },
    {
        id: 3,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425533/franco-alva-i08V_pjCeaE-unsplash_jqaqsa.jpg',
        alt: 'Pareja paseando al aire libre',
    },
    {
        id: 5,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425511/christian-buehner-vifgJdxrjRY-unsplash_nrzhhg.jpg',
        alt: 'Pareja compartiendo un momento cotidiano',
    },
    {
        id: 6,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425510/saniah-simpson-8mSfqlYGrSs-unsplash_zehu2w.jpg',
        alt: 'Dos personas abrazadas en un espacio exterior',
    },
    {
        id: 7,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425511/les-taylor-sDnZMYNjX7g-unsplash_oidgdu.jpg',
        alt: 'Persona mirando a cámara con expresión amable',
    },
    {
        id: 8,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425511/camila-cordeiro-x9kIDS9tUCU-unsplash_wyjdpz.jpg',
        alt: 'Persona sonriendo en un retrato natural',
    },
    {
        id: 9,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425512/natali-hordiiuk-WHNWkO1lBKU-unsplash_teulpa.jpg',
        alt: 'Pareja en un momento cercano y tranquilo',
    },
    {
        id: 10,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425511/juliana-kozoski-6J-Isf7Yjzw-unsplash_hpe8au.jpg',
        alt: 'Persona en retrato natural con fondo suave',
    },
    {
        id: 11,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778427301/nina-hill-2n7DBujSttY-unsplash_ovan12.jpg',
        alt: 'Persona sonriendo con naturalidad',
    },
    {
        id: 12,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425510/matias-ilizarbe-kA_mNu_zExM-unsplash_vplnat.jpg',
        alt: 'Persona con expresión tranquila y cercana',
    },
    {
        id: 14,
        src: 'https://res.cloudinary.com/dc4u0bzgh/image/upload/v1778425512/randy-kinne-Bo8tVzieMjw-unsplash_wdg0x8.jpg',
        alt: 'Persona en retrato natural',
    },
] as const;

const getOptimizedImageSrc = (src: string) => src.replace('/upload/', '/upload/f_auto,q_auto,w_560/');

type WelcomeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

const WelcomePrimaryButton: React.FC<WelcomeButtonProps> = ({ className = '', children, ...props }) => (
    <button
        {...props}
        className={`welcome-button inline-flex items-center justify-center rounded-full bg-bluvi-purple px-8 py-4 text-lg font-black text-white shadow-xl shadow-[#7F77DD]/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30 ${className}`}
    >
        {children}
    </button>
);

const WelcomeSecondaryButton: React.FC<WelcomeButtonProps> = ({ className = '', children, ...props }) => (
    <button
        {...props}
        className={`welcome-button inline-flex items-center justify-center rounded-full border-2 border-[#C4C0F0] bg-white px-8 py-4 text-lg font-black text-[#534AB7] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/25 ${className}`}
    >
        {children}
    </button>
);



const CARE_POINTS = [
    {
        n: '01',
        title: 'Doble verificación',
        desc: 'Verificación de identidad y señales de confianza para reducir perfiles falsos y crear una comunidad más cuidada.',
    },
    {
        n: '02',
        title: 'Seguridad y privacidad',
        desc: 'Tus datos, tus fotos y tus conversaciones se tratan con cuidado. Puedes bloquear, reportar y decidir cómo quieres aparecer.',
    },
    {
        n: '03',
        title: 'Herramientas de accesibilidad',
        desc: 'Modo oscuro, alto contraste, reducción de movimiento y ajustes visuales para adaptar Bluvi a distintas sensibilidades.',
    },
    {
        n: '04',
        title: 'Ritmo más amable',
        desc: 'Sin presión por responder al instante. Bluvi ayuda a iniciar conversaciones y a conectar con más calma.',
    },
] as const;

const STEPS = [
    {
        n: '01',
        title: 'Crea tu perfil',
        desc: 'Comparte tus intereses, tu forma de comunicarte y aquello que ayude a otras personas a entenderte mejor.',
    },
    {
        n: '02',
        title: 'Ajusta tu experiencia',
        desc: 'Configura accesibilidad, ritmo visual y preferencias para que Bluvi se adapte mejor a ti.',
    },
    {
        n: '03',
        title: 'Descubre personas afines',
        desc: 'Encuentra perfiles con intereses, valores y formas de conectar compatibles contigo.',
    },
    {
        n: '04',
        title: 'Empieza con ayuda',
        desc: 'Usa icebreakers y mensajes sugeridos para iniciar conversaciones sin sentir tanta presión.',
    },
] as const;

const ConnectionMuralSection: React.FC = () => {
    return (
        <section id="conexiones" className="relative scroll-mt-8 overflow-hidden bg-white/35 pb-24 pt-16 dark:bg-white/[0.04] sm:pb-32 sm:pt-20">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="max-w-xl">
            

            <h2 className="overflow-visible text-balance text-4xl font-black leading-[1.06] tracking-[-0.055em] text-[#25286F] dark:text-[#25286F] sm:text-5xl lg:text-6xl">
                A veces conectar no es sencillo.
                <span className="welcome-purple-flow mt-3 block pb-3 leading-[1.12] bg-clip-text text-transparent">
                Y no deberías tener que fingir para lograrlo.
                </span>
            </h2>

            <div className="mt-7 text-pretty text-lg font-semibold leading-8 text-[#25286F]/88 dark:text-[#25286F]/88">
                <p>
                Bluvi nace para quienes necesitan más calma al conocer a alguien:{' '}
                <strong className="font-black text-[#3F4292] dark:text-[#3F4292]">
                    empezar una conversación, responder a su ritmo y mostrarse sin miedo al rechazo.
                </strong>
                </p>
            </div>
            </div>

            <div className="relative">
            <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-3 xl:columns-4">
                {COUPLE_CARDS.map((card, index) => (
                <article
                    key={card.id}
                    className={`relative mb-3 break-inside-avoid overflow-hidden rounded-[1.7rem] bg-transparent p-0 shadow-lg shadow-[#7F77DD]/10 [content-visibility:auto] [contain-intrinsic-size:360px] sm:mb-4 ${
                    index % 5 === 0 ? 'mt-8' : ''
                    } ${index % 7 === 0 ? 'rotate-[-1deg]' : index % 4 === 0 ? 'rotate-[1deg]' : ''}`}
                >
                    <div className="relative overflow-hidden rounded-[1.45rem]">
                    <img
                        src={getOptimizedImageSrc(card.src)}
                        alt={card.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-cover"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#26215C]/20 via-transparent to-transparent opacity-70" />
                    </div>
                </article>
                ))}
            </div>

            </div>
        </div>
        </section>
    );
};

export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { resolvedTheme, setTheme } = useTheme();
    const [isThemeMounted, setIsThemeMounted] = React.useState(false);
    const [themeFusion, setThemeFusion] = React.useState<{ target: 'light' | 'dark'; visible: boolean } | null>(null);
    const isDarkTheme = isThemeMounted && resolvedTheme === 'dark';
    const fusionClass = themeFusion?.target === 'dark'
        ? 'bg-[linear-gradient(to_bottom_right,#1d214f,#2b2961_52%,#4c3850_78%,#614347_100%)]'
        : 'bg-[linear-gradient(to_bottom_right,#A5C9FF,#D8D1FF,#FFD5A1)]';

    useScrollToTop();

    React.useEffect(() => {
        if (isAuthenticated) {
        navigate('/app/home', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    React.useEffect(() => {
        setIsThemeMounted(true);
    }, []);

    const handleThemeToggle = () => {
        const nextTheme = isDarkTheme ? 'light' : 'dark';

        setThemeFusion({ target: nextTheme, visible: false });
        window.setTimeout(() => setThemeFusion({ target: nextTheme, visible: true }), 20);
        window.setTimeout(() => setTheme(nextTheme), 320);
        window.setTimeout(() => setThemeFusion({ target: nextTheme, visible: false }), 360);
        window.setTimeout(() => setThemeFusion(null), 760);
    };

    return (
        <div className={`min-h-screen w-full overflow-x-hidden bg-app-gradient font-sans text-[#26215C] dark:text-[#ECEBFF] ${
            themeFusion ? 'welcome-theme-transition' : ''
        }`}>
        {themeFusion && (
            <div
            className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 ease-in-out ${fusionClass} ${
                themeFusion.visible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
            />
        )}

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-[#C4C0F0]/40 blur-3xl" />
            <div className="absolute right-[-8%] top-[18%] h-96 w-96 rounded-full bg-[#F6CDE8]/35 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[20%] h-96 w-96 rounded-full bg-[#BDECDC]/30 blur-3xl" />
        </div>

        <header className="absolute inset-x-0 top-0 z-50">
            <nav
            className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-3 px-5 py-5 sm:px-8 lg:px-10"
            aria-label="Navegación principal"
            >
            <div
            className="hidden items-center justify-start gap-7 md:flex lg:gap-9"
            aria-label="Secciones de la página"
            >
            {NAV_LINKS.map((link) => (
                <a
                key={link.href}
                href={link.href}
                className="border-b-2 border-current px-1 py-1 text-base font-black text-[#26215C] transition hover:text-[#534AB7] focus:outline-none focus-visible:rounded-md focus-visible:ring-4 focus-visible:ring-[#7F77DD]/25 dark:text-white dark:hover:text-[#D0CCFF] lg:text-lg"
                >
                {link.label}
                </a>
            ))}
            </div>

            <button
            type="button"
            onClick={() => navigate('/')}
            className="justify-self-center rounded-full py-1 drop-shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30"
            aria-label="Ir al inicio de Bluvi"
            >
            <img src={logo} alt="Bluvi" className="h-auto w-32 sm:w-40" />
            </button>

            <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button
            type="button"
            onClick={handleThemeToggle} 
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-black text-[#26215C] shadow-lg shadow-[#7F77DD]/12 transition hover:bg-[#F8F7FF] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30 dark:bg-white/15 dark:text-white dark:hover:bg-white/22 sm:px-4"
            aria-label={isDarkTheme ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={isDarkTheme}
            >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#26215C] text-white dark:bg-white dark:text-[#26215C]" aria-hidden="true">
                {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
            <span className="hidden min-w-[5.9rem] text-left sm:inline">
                {isDarkTheme ? 'Modo oscuro' : 'Modo claro'}
            </span>
            <span className="sr-only">{isDarkTheme ? 'Modo oscuro activo' : 'Modo claro activo'}</span>
            </button>

            <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#26215C] shadow-lg shadow-[#7F77DD]/12 transition hover:bg-[#F8F7FF] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30 dark:bg-white dark:text-[#26215C] sm:px-6 sm:py-3 sm:text-base"
            >
            Iniciar sesión
            </button>
            </div>

            <div className="col-span-3 flex items-center justify-center gap-5 md:hidden" aria-label="Secciones de la página">
            {NAV_LINKS.map((link) => (
                <a
                key={link.href}
                href={link.href}
                className="border-b-2 border-current px-1 py-1 text-sm font-black text-[#26215C] transition hover:text-[#534AB7] focus:outline-none focus-visible:rounded-md focus-visible:ring-4 focus-visible:ring-[#7F77DD]/25 dark:text-white dark:hover:text-[#D0CCFF]"
                >
                {link.label}
                </a>
            ))}
            </div>
            </nav>
        </header>

        <main id="main-content">
            <section className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-7xl items-center justify-center px-5 pb-20 pt-32 sm:min-h-[calc(100vh-80px)] sm:px-8 sm:pt-36 lg:pb-24 lg:pt-32">
            <div className="mx-auto max-w-3xl text-center">
                <p className="mb-8 text-xs font-black uppercase tracking-[0.22em] text-[#534AB7] sm:text-sm">
                <strong className="font-black text-[#3F4292]">
                La primera red social de citas neurodivergentes de España
                </strong>
                </p>

                <h1 className="text-balance text-[clamp(2.25rem,4.6vw,4.25rem)] font-black leading-[1.08] tracking-[-0.04em] text-[#26215C]">
                Conoce gente a tu ritmo,
                <span className="block pb-1 bg-gradient-to-r from-[#7F77DD] via-[#9F7AEA] to-[#D477B8] bg-clip-text text-transparent">
                    sin dejar de ser tú
                </span>
                </h1>

                <p className="mx-auto mt-9 max-w-xl text-pretty text-base font-medium leading-7 text-[#3d3867]/85 sm:text-lg">
                Una forma más tranquila de descubrir personas afines, conversar sin presión y cuidar tu energía social
                </p>

                <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <WelcomePrimaryButton
                    onClick={() => navigate('/register/name')}
                    className="group w-full gap-2 sm:w-auto"
                >
                    Crear mi espacio
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </WelcomePrimaryButton>
                </div>
            </div>
            </section>

            <ConnectionMuralSection />

            <section id="cuidado" className="scroll-mt-32 border-y border-white/80 bg-white/10 py-24 sm:scroll-mt-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="mx-auto max-w-3xl text-center">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#7F77DD]">Qué hace diferente a Bluvi</span>
                <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] text-[#25286F] sm:text-5xl">
                    Una app de citas pensada para personas neurodivergentes.
                </h2>
                <p className="mt-5 text-lg font-medium leading-8 text-[#25286F]/75">
                    Bluvi está diseñada para personas autistas, con TDAH, dislexia y otras formas de neurodivergencia que buscan conocer gente sin presión, con más claridad y más control sobre la experiencia.
                </p>
                </div>

                <div className="mt-14 ">
                {CARE_POINTS.map((point) => (
                    <article key={point.title} className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:py-9 lg:grid-cols-[6rem_0.9fr_1.3fr] lg:items-start">
                    <p className="text-sm font-black tracking-[0.3em] text-[#3F4292]">{point.n}</p>
                    <h3 className="text-2xl font-black tracking-[-0.03em] text-[#3F4292]">{point.title}</h3>
                    <p className="text-base font-medium leading-7 text-[#3F4292]/78 lg:pt-1">{point.desc}</p>
                    </article>
                ))}
                </div>
            </div>
            </section>

            <section id="idea" className="scroll-mt-32 py-24 sm:scroll-mt-24 sm:py-28">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#7F77DD]">Una idea sencilla</span>
                <h2 className="mt-4 text-balance text-3xl font-black leading-tight tracking-[-0.04em] text-[#26215C] sm:text-5xl">
                    No todo el mundo conecta igual.
                </h2>
                </div>

                <div className="rounded-[2.2rem] border border-[#C4C0F0]/45 bg-white/65 p-7 shadow-xl shadow-[#7F77DD]/10 backdrop-blur sm:p-10">
                <p className="text-pretty text-xl font-semibold leading-9 text-[#3d3867]/85">
                    Hay personas que necesitan más tiempo para responder. Más claridad para entender las intenciones. Más calma para iniciar una conversación. Más control sobre lo que ven, cómo interactúan y cuándo avanzar.
                </p>
                <p className="mt-6 text-pretty text-xl font-semibold leading-9 text-[#3d3867]/85">
                    Bluvi nace de esa idea: socializar no debería sentirse como una competición ni como una sobrecarga constante. También puede ser algo amable, gradual y cuidado.
                </p>
                </div>
            </div>
            </section>

            <section id="como-funciona" className="scroll-mt-32 bg-[#26215C] py-24 text-white sm:scroll-mt-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="max-w-2xl">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#C4C0F0]">Cómo funciona</span>
                <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                    Cuatro pasos, sin forzar el ritmo.
                </h2>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {STEPS.map((step) => (
                    <article key={step.n} className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur">
                    <p className="text-sm font-black tracking-[0.18em] text-[#C4C0F0]">{step.n}</p>
                    <h3 className="mt-5 text-2xl font-black tracking-[-0.03em]">{step.title}</h3>
                    <p className="mt-4 text-[15px] font-medium leading-7 text-white/72">{step.desc}</p>
                    </article>
                ))}
                </div>
            </div>
            </section>

            <section className="px-5 py-24 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-[#C4C0F0]/50 bg-white/75 p-8 text-center shadow-2xl shadow-[#7F77DD]/15 backdrop-blur sm:p-12">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F7FF] text-[#7F77DD]">
                <HeartHandshake className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="text-balance text-3xl font-black tracking-[-0.04em] text-[#26215C] sm:text-5xl">
                Empieza con calma.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-[#3d3867]/75">
                Crea tu espacio, configura la experiencia a tu manera y descubre personas cuando te apetezca hacerlo.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <WelcomePrimaryButton
                    onClick={() => navigate('/register/name')}
                    className="group gap-2"
                >
                    Crear mi espacio
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </WelcomePrimaryButton>

                <WelcomeSecondaryButton
                    onClick={() => navigate('/login')}
                >
                    Ya tengo cuenta
                </WelcomeSecondaryButton>
                </div>
            </div>
            </section>
        </main>

        <Footer />

        <style>{`
            html {
            scroll-behavior: smooth;
            }

            .welcome-theme-transition #main-content,
            .welcome-theme-transition #main-content *,
            .welcome-theme-transition header,
            .welcome-theme-transition header * {
            transition-property: background-color, background-image, border-color, color, fill, stroke, box-shadow, opacity, transform;
            transition-duration: 280ms;
            transition-timing-function: ease;
            }

            .welcome-purple-flow {
            background-image: linear-gradient(to right, #7F77DD, #9F7AEA, #D477B8);
            }

            .welcome-button {
            transition-property: background-color, border-color, box-shadow, color, filter;
            transition-duration: 260ms;
            transition-timing-function: ease;
            }

            .welcome-button:hover {
            filter: brightness(1.04);
            box-shadow: 0 18px 38px -22px rgba(63, 66, 146, 0.55);
            }

            @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                scroll-behavior: auto !important;
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
            }

            }
        `}</style>
        </div>
    );
};
