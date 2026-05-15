import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
    ArrowRightIcon,
    MicrophoneIcon,
    MoonIcon,
    SlidersHorizontalIcon,
    SpeakerHighIcon,
    SunIcon,
} from '@phosphor-icons/react';

import { Footer } from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import logo from '../../assets/logo.svg';

const NAV_LINKS = [
    { href: '#conexiones', label: 'Conexiones reales' },
    { href: '#cuidado', label: 'Seguridad' },
    { href: '#accesibilidad', label: 'Accesibilidad' },
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

const ACCESSIBILITY_POINTS = [
    {
        title: 'Narración de textos largos',
        desc: 'Lee con menos esfuerzo cuando hay demasiada información.',
        icon: SpeakerHighIcon,
    },
    {
        title: 'Transcripción de audios',
        desc: 'Convierte notas de voz en texto cuando lo necesites.',
        icon: MicrophoneIcon,
    },
    {
        title: 'Ajustes visuales',
        desc: 'Modo oscuro, alto contraste y reducción de movimiento.',
        icon: SlidersHorizontalIcon,
    },
] as const;

const getOptimizedImageSrc = (src: string) =>
    src.replace('/upload/', '/upload/f_auto,q_auto,w_560/');

const SECTION_FOCUS_CLASS =
    'outline-none transition-[box-shadow] duration-300 ease-in-out focus-visible:ring-4 focus-visible:ring-[#5146C6]/25 focus-visible:ring-inset';

const DESKTOP_NAV_LINK_CLASS =
    'border-b-2 border-current px-1 py-1 text-base font-black text-[#221B5F] transition hover:text-[#383296] focus:outline-none focus-visible:rounded-md focus-visible:ring-4 focus-visible:ring-[#5146C6]/25 dark:text-[#D8D1FF] dark:hover:text-white lg:text-lg';

const MOBILE_MENU_ITEM_CLASS =
    'rounded-2xl px-4 py-3 text-sm font-black text-[#221B5F] transition hover:bg-[#F8F7FF] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/25 dark:text-white dark:hover:bg-white/10';

type WelcomeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

type WelcomePrimaryButtonProps = WelcomeButtonProps & {
    isDarkTheme?: boolean;
};

const WelcomePrimaryButton: React.FC<WelcomePrimaryButtonProps> = ({
    isDarkTheme = false,
    className = '',
    children,
    ...props
}) => (
    <button
        {...props}
        className={`welcome-primary-button inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-black transition-[background-color,border-color,color,filter] duration-[260ms] ease-in-out hover:brightness-[1.08] focus:outline-none focus-visible:ring-4 sm:px-8 sm:py-4 sm:text-lg ${
            isDarkTheme
                ? '!bg-[#D8D1FF] !text-[#241e5b] focus-visible:ring-[#D8D1FF]/35'
                : '!bg-[#221B5F] !text-white focus-visible:ring-[#221B5F]/30'
        } ${className}`}
    >
        {children}
    </button>
);

const WelcomeSecondaryButton: React.FC<WelcomeButtonProps> = ({
    className = '',
    children,
    ...props
}) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center rounded-full border-2 border-[#383296]/25 bg-white/90 px-7 py-3.5 text-base font-black text-[#221B5F] shadow-xl shadow-[#383296]/12 transition-[background-color,border-color,box-shadow,color,filter] duration-[260ms] ease-in-out hover:brightness-[1.08] hover:shadow-[0_18px_38px_-20px_rgba(56,50,150,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#383296]/25 dark:border-white/20 dark:bg-white/12 dark:text-white sm:px-8 sm:py-4 sm:text-lg ${className}`}
    >
        {children}
    </button>
);

type WelcomeCreateSpaceButtonProps = Omit<WelcomePrimaryButtonProps, 'children'>;

const WelcomeCreateSpaceButton: React.FC<WelcomeCreateSpaceButtonProps> = ({
    className = '',
    ...props
}) => (
    <WelcomePrimaryButton {...props} className={`group w-full gap-2 sm:w-auto ${className}`}>
        Crear mi espacio
        <ArrowRightIcon
            className="h-5 w-5 transition group-hover:translate-x-0.5"
            weight="bold"
            aria-hidden="true"
        />
    </WelcomePrimaryButton>
);

const ConnectionMuralSection: React.FC = () => {
    return (
        <section
            id="conexiones"
            tabIndex={0}
            aria-labelledby="conexiones-title"
            aria-describedby="conexiones-desc"
            className={`relative scroll-mt-24 overflow-hidden pb-16 pt-14 sm:scroll-mt-28 sm:pb-28 sm:pt-20 ${SECTION_FOCUS_CLASS}`}
        >
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
                <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
                    <h2
                        id="conexiones-title"
                        className="overflow-visible text-balance text-[2.45rem] font-black leading-[1.04] tracking-[-0.055em] text-[#221B5F] dark:text-white sm:text-5xl xl:text-6xl"
                    >
                            Mereces sentirte querido
                        <span className="mt-3 block pb-3 leading-[1.12] text-[#221B5F] dark:bg-gradient-to-r dark:from-[#D8D1FF] dark:via-[#ECEBFF] dark:to-[#D8D1FF] dark:bg-clip-text dark:text-transparent">
                            siendo tú mismo.
                        </span>
                    </h2>

                    <div className="mt-6 text-pretty text-base font-bold leading-7 text-[#221B5F] dark:text-[#ECEBFF] sm:mt-7 sm:text-lg sm:leading-8">
                        <p id="conexiones-desc">
                            Todas las personas merecen conectar desde un lugar seguro, tranquilo y auténtico, sin presión por encajar o fingir ser alguien distinto.
                        </p>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-none lg:mx-0">
                    <div className="columns-3 gap-2 sm:columns-3 sm:gap-4 xl:columns-4">
                        {COUPLE_CARDS.map((card, index) => (
                            <article
                                key={card.id}
                                className={`relative mb-2 break-inside-avoid overflow-hidden rounded-[0.9rem] bg-transparent p-0 shadow-lg shadow-[#7F77DD]/10 [content-visibility:auto] [contain-intrinsic-size:160px] sm:mb-4 sm:rounded-[1.7rem] sm:[contain-intrinsic-size:360px] ${
                                    index > 8 ? 'hidden sm:block' : ''
                                } ${index % 5 === 0 ? 'sm:mt-8' : ''} ${
                                    index % 7 === 0
                                        ? 'sm:rotate-[-1deg]'
                                        : index % 4 === 0
                                            ? 'sm:rotate-[1deg]'
                                            : ''
                                }`}
                            >
                                <div className="relative overflow-hidden rounded-[0.8rem] sm:rounded-[1.45rem]">
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [themeFusion, setThemeFusion] = React.useState<{
        target: 'light' | 'dark';
        visible: boolean;
    } | null>(null);
    const careSectionRef = React.useRef<HTMLElement | null>(null);
    const [isCareArrowVisible, setIsCareArrowVisible] = React.useState(false);

    const isDarkTheme = isThemeMounted && resolvedTheme === 'dark';

    const fusionClass =
        themeFusion?.target === 'dark'
            ? 'bg-[linear-gradient(to_bottom_right,#1d214f,#2b2961_52%,#4c3850_78%,#8A4F38_100%)]'
            : 'bg-[linear-gradient(to_bottom_right,#A5C9FF,#D8D1FF_48%,#B8B2FF_100%)]';

    useScrollToTop();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/app/home', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    React.useEffect(() => {
        setIsThemeMounted(true);
    }, []);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    }, [resolvedTheme]);

    React.useEffect(() => {
        const careSection = careSectionRef.current;

        if (!careSection) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            setIsCareArrowVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsCareArrowVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(careSection);

        return () => observer.disconnect();
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
        <>
            <div
                className={`welcome-page-enter min-h-screen w-full scroll-smooth overflow-x-hidden bg-app-gradient font-sans text-[#221B5F] motion-reduce:scroll-auto motion-reduce:[&_*]:!animate-none motion-reduce:[&_*]:!transition-none dark:text-[#ECEBFF] ${
                    !isDarkTheme
                        ? '[&_a]:!text-[#221B5F] [&_button]:!text-[#221B5F] [&_h1]:!text-[#221B5F] [&_h2]:!text-[#221B5F] [&_h3]:!text-[#221B5F] [&_p]:!text-[#221B5F] [&_span]:!text-[#221B5F] [&_strong]:!text-[#221B5F] [&_svg]:!text-[#221B5F] [&_.welcome-primary-button]:!text-white [&_.welcome-primary-button_*]:!text-white [&_.welcome-dark-section]:!text-white [&_.welcome-dark-section_*]:!text-white [&_.welcome-accessibility-card]:!text-white [&_.welcome-accessibility-card_*]:!text-white'
                        : ''
                } ${
                    themeFusion
                        ? '[&_#main-content]:transition-[background-color,background-image,border-color,color,fill,stroke,box-shadow,opacity,transform] [&_#main-content]:duration-[280ms] [&_#main-content]:ease-in-out [&_#main-content_*]:transition-[background-color,background-image,border-color,color,fill,stroke,box-shadow,opacity,transform] [&_#main-content_*]:duration-[280ms] [&_#main-content_*]:ease-in-out [&_header]:transition-[background-color,background-image,border-color,color,fill,stroke,box-shadow,opacity,transform] [&_header]:duration-[280ms] [&_header]:ease-in-out [&_header_*]:transition-[background-color,background-image,border-color,color,fill,stroke,box-shadow,opacity,transform] [&_header_*]:duration-[280ms] [&_header_*]:ease-in-out'
                        : ''
                }`}
            >
                {themeFusion && (
                    <div
                        className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 ease-in-out ${fusionClass} ${
                            themeFusion.visible ? 'opacity-100' : 'opacity-0'
                        }`}
                        aria-hidden="true"
                    />
                )}

                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[70] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-black focus:text-[#221B5F] focus:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/30 dark:focus:bg-[#221B5F] dark:focus:text-white"
                >
                    Saltar al contenido principal
                </a>

                <header className="absolute inset-x-0 top-0 z-50">
                    <nav
                    className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-8 sm:py-5 lg:px-10"
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
                                className={DESKTOP_NAV_LINK_CLASS}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="col-start-2 justify-self-center">
                        <img
                            src={logo}
                            alt="Bluvi"
                            className="h-auto w-56 lg:w-64"
                        />
                    </div>
                    <div className="col-start-3 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleThemeToggle}
                            className="hidden items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-black text-[#221B5F] shadow-lg shadow-[#383296]/12 transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/30 dark:bg-white/15 dark:text-white dark:hover:bg-white/22 md:flex sm:px-4"
                            aria-label={isDarkTheme ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        >
                            <span
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#221B5F] shadow-sm shadow-[#383296]/12"
                                aria-hidden="true"
                            >
                                {isDarkTheme ? (
                                    <MoonIcon className="h-4 w-4" weight="bold" />
                                ) : (
                                    <SunIcon className="h-4 w-4" weight="bold" />
                                )}
                            </span>

                            <span className="hidden sm:inline">
                                {isDarkTheme ? 'Modo oscuro' : 'Modo claro'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="hidden rounded-full bg-white/95 px-6 py-3 text-base font-black text-[#221B5F] shadow-lg shadow-[#383296]/12 transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/30 dark:bg-white dark:text-[#221B5F] md:inline-flex"
                        >
                            Iniciar sesión
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-4 text-sm font-black text-[#221B5F] shadow-lg shadow-[#383296]/12 transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/30 dark:bg-white dark:text-[#221B5F] md:hidden"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMobileMenuOpen ? 'Cerrar' : 'Menú'}
                        </button>
                    </div>

                    <div
                        id="mobile-menu"
                        className={`absolute right-4 top-[5.3rem] z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] border border-white/40 bg-white/95 shadow-2xl shadow-[#383296]/18 backdrop-blur-xl transition-all duration-200 ease-out dark:border-white/10 dark:bg-[#221B5F]/95 md:hidden ${
                            isMobileMenuOpen
                                ? 'translate-y-0 opacity-100'
                                : 'pointer-events-none -translate-y-2 opacity-0'
                        }`}
                    >
                        <div className="flex flex-col gap-2 p-3">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={MOBILE_MENU_ITEM_CLASS}
                                >
                                    {link.label}
                                </a>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    handleThemeToggle();
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`flex items-center justify-between text-left ${MOBILE_MENU_ITEM_CLASS}`}
                            >
                                <span>
                                    {isDarkTheme ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                                </span>

                                {isDarkTheme ? (
                                    <SunIcon className="h-5 w-5" weight="bold" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" weight="bold" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate('/login');
                                }}
                                className="mt-1 rounded-2xl bg-[#221B5F] px-4 py-3 text-left text-sm font-black text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5146C6]/30 dark:bg-[#D8D1FF] dark:text-[#221B5F]"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </nav>
                </header>

                <main id="main-content" tabIndex={-1} aria-labelledby="welcome-title" className="outline-none">
                    <section
                        tabIndex={0}
                        aria-labelledby="welcome-title"
                        aria-describedby="welcome-desc"
                        className={`mx-auto flex min-h-[92vh] w-full max-w-7xl scroll-mt-24 items-center justify-center px-5 pb-14 pt-36 sm:min-h-[calc(100vh-80px)] sm:scroll-mt-28 sm:px-8 sm:pt-40 lg:pb-24 lg:pt-36 ${SECTION_FOCUS_CLASS}`}
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="mb-7 text-xs font-black uppercase tracking-[0.18em] text-[#221B5F] dark:text-[#D8D1FF] sm:mb-8 sm:tracking-[0.22em] sm:text-sm">
                                La primera red social de citas neurodivergentes de España
                            </p>

                            <h1
                                id="welcome-title"
                                className="text-balance text-[clamp(2.15rem,12vw,4.6rem)] font-black leading-[1.03] tracking-[-0.055em] text-[#221B5F] dark:text-white"
                            >
                                Conoce gente a tu ritmo,
                                <span className="block pb-2 text-[#221B5F] dark:bg-gradient-to-r dark:from-[#D8D1FF] dark:via-[#ECEBFF] dark:to-[#D8D1FF] dark:bg-clip-text dark:text-transparent">
                                    sin dejar de ser tú
                                </span>
                            </h1>


                            <div className="mt-9 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center">
                                <WelcomeCreateSpaceButton
                                    isDarkTheme={isDarkTheme}
                                    onClick={() => navigate('/register/name')}
                                />
                            </div>
                        </div>
                    </section>

                    <ConnectionMuralSection />

                    <section
                        id="cuidado"
                        ref={careSectionRef}
                        tabIndex={0}
                        aria-labelledby="cuidado-title"
                        aria-describedby="cuidado-desc"
                        className={`welcome-dark-section scroll-mt-24 bg-[#221B5F] py-16 text-white dark:bg-[#241e5b] sm:scroll-mt-24 sm:py-28 ${SECTION_FOCUS_CLASS}`}
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="mx-auto max-w-3xl pb-8 text-center sm:pb-12">
                                <h2
                                    id="cuidado-title"
                                    className="mt-4 text-balance text-[2.1rem] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl"
                                >
                                    Un espacio donde sentirte más seguro.
                                </h2>

                                <p id="cuidado-desc" className="sr-only">
                                    Verifica tu perfil para crear confianza y controla tus límites dentro de Bluvi.
                                </p>
                            </div>

                            <div className="relative mt-10 sm:mt-16">
                                <div
                                    className="pointer-events-none absolute left-1/2 top-[9rem] hidden -translate-x-1/2 text-[#D8D1FF] lg:block"
                                    aria-hidden="true"
                                >
                                    <svg
                                        className={`welcome-care-arrow ${
                                            isCareArrowVisible ? 'welcome-care-arrow-visible' : ''
                                        }`}
                                        width="96"
                                        height="96"
                                        viewBox="0 0 96 96"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            className="welcome-care-arrow-line"
                                            d="M12 8C24 42 46 63 80 70"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="4 7"
                                        />
                                        <path
                                            className="welcome-care-arrow-head"
                                            d="M67 56L81 70L60 74"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <div className="flex flex-col gap-9 sm:gap-12">
                                    <article className="mr-auto max-w-[18rem] text-left sm:max-w-xl lg:mx-0">
                                        <p className="text-pretty text-[1.38rem] font-black leading-[1.16] tracking-[-0.04em] text-white sm:text-3xl">
                                            Verifica tu perfil y crea más confianza.
                                        </p>

                                        <p className="mt-3 max-w-[17rem] text-sm font-bold leading-6 text-white/84 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-8">
                                            Verificar tu perfil ayuda a que las conexiones se sientan más reales, claras y seguras.
                                        </p>
                                    </article>

                                    <article className="ml-auto max-w-[18rem] text-right sm:max-w-xl lg:mt-1">
                                        <p className="text-pretty text-[1.38rem] font-black leading-[1.16] tracking-[-0.04em] text-white sm:text-3xl">
                                            Tu espacio, tus límites.
                                        </p>

                                        <p className="ml-auto mt-3 max-w-[17rem] text-sm font-bold leading-6 text-white/84 sm:mt-4 sm:max-w-lg sm:text-lg sm:leading-8">
                                            En Bluvi puedes borrar tu cuenta cuando quieras y decidir qué compartir en cada momento.
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="accesibilidad"
                        tabIndex={0}
                        aria-labelledby="accesibilidad-title"
                        aria-describedby="accesibilidad-desc"
                        className={`scroll-mt-24 py-16 sm:scroll-mt-24 sm:py-28 ${SECTION_FOCUS_CLASS}`}
                    >
                        <div className="mx-auto max-w-6xl px-5 sm:px-8">
                            <div className="mx-auto max-w-xl text-center">
                                <h2
                                    id="accesibilidad-title"
                                    className="mt-4 text-balance text-[2.1rem] font-black leading-[1.05] tracking-[-0.04em] text-[#221B5F] dark:text-white sm:text-5xl"
                                >
                                    Ajusta Bluvi a tu forma de sentir, leer y comunicarte.
                                </h2>

                                <p
                                    id="accesibilidad-desc"
                                    className="mx-auto mt-5 max-w-xl text-base font-bold leading-7 text-[#221B5F] dark:text-[#ECEBFF] sm:mt-6 sm:text-lg sm:leading-8"
                                >
                                    Herramientas para reducir la sobrecarga y adaptar la experiencia a tu ritmo.
                                </p>
                            </div>

                            <ul className="mx-auto mt-14 grid gap-5 text-left sm:mt-20 sm:grid-cols-3 sm:gap-7">
                                {ACCESSIBILITY_POINTS.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <li
                                            key={item.title}
                                            className="welcome-accessibility-card group min-h-[14.5rem] rounded-3xl border border-white/12 bg-[#221B5F] px-8 py-9 text-center text-white backdrop-blur-sm dark:border-white/10 dark:bg-[#221B5F] sm:px-10 sm:py-11 sm:text-left"
                                        >
                                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-4">
                                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D8D1FF] ">
                                                    <Icon className="h-8 w-8" weight="bold" aria-hidden="true" />
                                                </span>

                                                <h3 className="text-lg font-black tracking-[-0.03em] text-white sm:text-xl">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <p className="mt-7 text-base font-semibold leading-7 text-white/78">
                                                {item.desc}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>

                    <section
    id="empieza"
    tabIndex={0}
    aria-labelledby="empieza-title"
    aria-describedby="empieza-desc"
    className={`px-5 py-20 sm:px-8 sm:py-32 ${SECTION_FOCUS_CLASS}`}
>
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 overflow-hidden p-6 text-center sm:gap-14 sm:p-16">

        <h2
            id="empieza-title"
            className="max-w-3xl text-balance text-[2.1rem] font-black leading-[1.05] tracking-[-0.04em] text-[#221B5F] dark:text-white sm:text-5xl"
        >
            Cuando quieras, Bluvi te espera.
        </h2>

        <p
            id="empieza-desc"
            className="max-w-2xl text-base font-bold leading-7 text-[#221B5F] dark:text-[#ECEBFF] sm:text-lg sm:leading-8"
        >
            Crea tu espacio con calma, ajusta la experiencia a tu manera y empieza a conectar solo cuando te sientas preparado.
        </p>

        <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <WelcomeCreateSpaceButton
                isDarkTheme={isDarkTheme}
                onClick={() => navigate('/register/name')}
            />

            <WelcomeSecondaryButton
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
            >
                Ya tengo cuenta
            </WelcomeSecondaryButton>
        </div>
    </div>
</section>
                </main>
            </div>

            <Footer />
        </>
    );
};
