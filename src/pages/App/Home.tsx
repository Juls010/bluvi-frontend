import React, { useMemo, useRef, useState } from 'react';
import {
    useNavigate } from 'react-router-dom';
import {
    ArrowRightIcon,
    BellIcon,
    CalendarBlankIcon,
    CaretLeftIcon,
    CaretRightIcon,
    MapPinIcon,
    ChatCircleIcon,
    ChatsIcon,
    UserIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { HOME_EVENTS } from '../../data/events';
import { BluAssistant } from '../../components/BluAssistant';
import { NarrationButton } from '../../components/NarrationButton';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { unreadMessages, pendingMatchRequests, hasNotifications } = useNotifications();

    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentHomeEvent = HOME_EVENTS[currentEventIndex] ?? HOME_EVENTS[0];

    const displayName = useMemo(() => {
        const rawName =
            (user as { first_name?: string; firstName?: string; name?: string } | null)?.first_name ||
            (user as { first_name?: string; firstName?: string; name?: string } | null)?.firstName ||
            (user as { first_name?: string; firstName?: string; name?: string } | null)?.name ||
            '';

        const cleaned = typeof rawName === 'string' ? rawName.trim() : '';
        if (!cleaned) return 'amiga';
        return cleaned.split(' ')[0];
    }, [user]);

    const welcomeMessage = useMemo(() => {
        const gender = Number((user as { id_gender?: number | string | null } | null)?.id_gender);
        return gender === 2 ? 'Bienvenido' : 'Bienvenida';
    }, [user]);

    const activityMessage = useMemo(() => {
        if (!hasNotifications && pendingMatchRequests === 0) {
            return 'Todo está en calma por aquí. Disfruta de tu espacio.';
        }

        const parts = [];
        if (unreadMessages > 0) {
            parts.push(`${unreadMessages} mensaje${unreadMessages > 1 ? 's' : ''} nuevo${unreadMessages > 1 ? 's' : ''}`);
        }
        if (pendingMatchRequests > 0) {
            parts.push(`${pendingMatchRequests} solicitud${pendingMatchRequests > 1 ? 'es' : ''} de conexión`);
        }

        if (parts.length === 1) {
            return `Tienes ${parts[0]} esperando respuesta.`;
        }

        return `Tienes ${parts.join(' y ')} pendientes.`;
    }, [unreadMessages, pendingMatchRequests, hasNotifications]);

    const currentEventNarration = useMemo(() => {
        if (!currentHomeEvent) return '';

        const agenda = currentHomeEvent.agenda.length > 0
            ? `Puntos principales: ${currentHomeEvent.agenda.join('. ')}.`
            : '';

        return [
            'Novedad de Bluvi.',
            currentHomeEvent.title,
            currentHomeEvent.text,
            currentHomeEvent.description,
            `Fecha: ${currentHomeEvent.dateLabel}.`,
            `Lugar: ${currentHomeEvent.place}.`,
            agenda,
            'Tienes todos los detalles visibles en esta tarjeta.',
        ].filter(Boolean).join(' ');
    }, [currentHomeEvent]);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const scrollPosition = scrollRef.current.scrollLeft;
        const width = scrollRef.current.offsetWidth;
        if (width > 0) {
            const newIndex = Math.round(scrollPosition / width);
            if (newIndex !== currentEventIndex) {
                setCurrentEventIndex(newIndex);
            }
        }
    };

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;

        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
            left: width * index,
            behavior: 'smooth',
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-12">
            <header className="pt-1 pb-6 animate-fade-in motion-reduce:animate-none">
                <span
                    aria-hidden="true"
                    className="px-4 py-2 mb-6"
                >
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-app-primary leading-[1.1] tracking-tight">
                    {welcomeMessage}, <span className="text-app-accent">{displayName}</span>
                </h1>
                <p className="text-app-secondary text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
                    ¿Qué te pide el cuerpo hoy? Navega a tu ritmo, sin presiones. Todo está pensado para ser tu refugio sensorial.
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/app/messages')}
                    aria-label={`Actividad: ${activityMessage}. Pulsa para ir a mensajes.`}
                    className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-app-surface-soft/40 backdrop-blur-md border border-app-soft/60 dark:border-app-accent/20 hover:bg-app-surface-soft/60 hover:border-app-accent/30 transition-all group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/30"
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-app-pill/50 group-hover:bg-app-pill transition-colors" aria-hidden="true">
                        <BellIcon size={22} weight="bold" className={`${hasNotifications || pendingMatchRequests > 0 ? 'text-app-accent' : 'text-app-muted'} transition-transform group-hover:scale-110`} />
                        {(hasNotifications || pendingMatchRequests > 0) && (
                            <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-app-surface-solid animate-pulse" />
                        )}
                    </div>
                    <span className={`text-[14px] font-semibold ${hasNotifications || pendingMatchRequests > 0 ? 'text-app-primary' : 'text-app-secondary'}`}>
                        {activityMessage}
                    </span>
                    {(hasNotifications || pendingMatchRequests > 0) && (
                        <ArrowRightIcon size={16} weight="bold" className="text-app-accent opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" aria-hidden="true" />
                    )}
                </button>
            </header>

            <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                    <section
                        className="bg-app-surface backdrop-blur-md border border-app-soft rounded-[22px] p-6"
                        aria-labelledby="actions-title"
                    >
                        <h2
                            id="actions-title"
                            className="text-[11px] font-black uppercase tracking-[0.15em] text-app-secondary mb-5"
                        >
                            Por dónde empezar
                        </h2>

                        <button
                            type="button"
                            onClick={() => navigate('/app/discovery')}
                            aria-label="Ir a Descubrir personas. Explorar perfiles nuevos."
                            className="w-full flex items-center justify-between gap-4 bg-app-pill hover:bg-app-surface-strong border border-app-strong rounded-[20px] px-6 py-5 mb-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/40"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[22px] bg-app-accent flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-app-accent/20" aria-hidden="true">
                                    <ChatCircleIcon size={32} weight="bold" className="text-app-on-accent" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-app-accent mb-1.5">
                                        Descubrir
                                    </p>
                                    <p className="text-[20px] font-black text-app-primary leading-tight">
                                        Explorar personas
                                    </p>
                                    <p className="text-[14.5px] text-app-muted mt-2 leading-relaxed">
                                        Nuevas conexiones en tu misma sintonía
                                    </p>
                                </div>
                            </div>
                            <ArrowRightIcon size={20} weight="bold" className="text-app-accent opacity-60" aria-hidden="true" />
                        </button>

                        <div className="grid grid-cols-2 gap-4" role="group" aria-label="Otras acciones">
                            <button
                                type="button"
                                onClick={() => navigate('/app/messages')}
                                aria-label="Ir a Mensajes. Revisar tus conversaciones."
                                className="bg-app-surface-soft hover:bg-app-surface-strong border border-app-soft rounded-[20px] px-5 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/40"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-app-pill flex items-center justify-center text-app-accent mb-5 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-app-accent group-hover:text-app-on-accent" aria-hidden="true">
                                    <ChatsIcon size={26} weight="bold" />
                                </div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-app-muted mb-2">
                                    Mensajes
                                </p>
                                <p className="text-[16px] font-black text-app-primary">
                                    Conversaciones
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/app/profile')}
                                aria-label="Ir a mi Perfil. Ajustar mi espacio."
                                className="bg-app-surface-soft hover:bg-app-surface-strong border border-app-soft rounded-[20px] px-5 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/40"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-app-pill flex items-center justify-center text-app-accent mb-5 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-app-accent group-hover:text-app-on-accent" aria-hidden="true">
                                    <UserIcon size={26} weight="bold" />
                                </div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-app-muted mb-2">
                                    Perfil
                                </p>
                                <p className="text-[16px] font-black text-app-primary">
                                    Mi espacio
                                </p>
                            </button>
                        </div>
                    </section>

                    <section
                        className="relative rounded-[28px] border border-app-soft bg-app-surface-soft backdrop-blur-md overflow-hidden group"
                        aria-roledescription="carrusel"
                        aria-label="Novedades de Bluvi"
                    >
                        <div className="flex flex-col gap-3 px-6 pt-6 pb-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-app-secondary">
                                    Novedades Bluvi
                                </h2>
                                {currentEventNarration && (
                                    <NarrationButton
                                        key={currentHomeEvent?.id ?? 'home-event'}
                                        text={currentEventNarration}
                                        label="Escuchar novedad"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2" role="group" aria-label="Controles de novedades">
                                <button
                                    type="button"
                                    onClick={() => scrollTo(currentEventIndex === 0 ? HOME_EVENTS.length - 1 : currentEventIndex - 1)}
                                    aria-label="Ver novedad anterior"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-500/30 motion-reduce:transition-none"
                                    style={{
                                        backgroundColor: 'var(--app-control-surface)',
                                        borderColor: 'var(--app-control-border)',
                                        color: 'var(--app-control-neutral)',
                                    }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface-hover)';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface)';
                                    }}
                                >
                                    <CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
                                </button>
                                <div className="flex gap-2" aria-label="Diapositiva actual">
                                    {HOME_EVENTS.map((_, index) => (
                                        <span
                                            key={index}
                                            className="h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
                                            style={{
                                                width: currentEventIndex === index ? '1.25rem' : '0.5rem',
                                                backgroundColor: currentEventIndex === index
                                                    ? 'var(--app-control-neutral)'
                                                    : 'var(--app-control-neutral-muted)',
                                            }}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => scrollTo(currentEventIndex === HOME_EVENTS.length - 1 ? 0 : currentEventIndex + 1)}
                                    aria-label="Ver siguiente novedad"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-500/30 motion-reduce:transition-none"
                                    style={{
                                        backgroundColor: 'var(--app-control-surface)',
                                        borderColor: 'var(--app-control-border)',
                                        color: 'var(--app-control-neutral)',
                                    }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface-hover)';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.backgroundColor = 'var(--app-control-surface)';
                                    }}
                                >
                                    <CaretRightIcon size={18} weight="bold" aria-hidden="true" />
                                </button>
                            </div>
                            <span className="sr-only" aria-live="polite">
                                Novedad {currentEventIndex + 1} de {HOME_EVENTS.length}
                            </span>
                        </div>

                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
                        >
                            {HOME_EVENTS.map((item) => {
                                const detailsId = `home-event-details-${item.id}`;

                                return (
                                    <div key={item.id} className="w-full flex-shrink-0 snap-center px-6 pt-2">
                                        <article
                                            aria-labelledby={`home-event-title-${item.id}`}
                                            className="bg-app-surface/80 dark:bg-app-surface-strong/60 border border-app-soft/60 dark:border-app-accent/15 rounded-2xl p-6 transition-all shadow-sm"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-app-accent bg-app-accent/15 px-2.5 py-1 rounded">
                                                    {item.meta}
                                                </span>
                                            </div>

                                            <h3
                                                id={`home-event-title-${item.id}`}
                                                className="text-[17px] font-black text-app-primary leading-tight tracking-tight"
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="text-[14.5px] text-app-secondary mt-3 line-clamp-2 leading-relaxed">
                                                {item.text}
                                            </p>

                                            <div
                                                id={detailsId}
                                                className="mt-5 border-t border-app-soft pt-5"
                                            >
                                                <p className="text-[14.5px] text-app-secondary leading-relaxed">
                                                    {item.description}
                                                </p>

                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                    <div className="flex items-start gap-3 rounded-2xl bg-app-surface-soft px-4 py-3 text-[13.5px] text-app-secondary">
                                                        <CalendarBlankIcon size={18} weight="bold" className="mt-0.5 shrink-0 text-app-accent" aria-hidden="true" />
                                                        <span>
                                                            <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-app-muted">Fecha</span>
                                                            <span className="font-bold text-app-primary">{item.dateLabel}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 rounded-2xl bg-app-surface-soft px-4 py-3 text-[13.5px] text-app-secondary">
                                                        <MapPinIcon size={18} weight="bold" className="mt-0.5 shrink-0 text-app-accent" aria-hidden="true" />
                                                        <span>
                                                            <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-app-muted">Lugar</span>
                                                            <span className="font-bold text-app-primary">{item.place}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-app-muted">
                                                        Qué incluye
                                                    </p>
                                                    <ul className="mt-3 space-y-2">
                                                        {item.agenda.map((agendaItem) => (
                                                            <li key={agendaItem} className="flex gap-3 text-[14px] leading-relaxed text-app-secondary">
                                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-app-accent" aria-hidden="true" />
                                                                <span>{agendaItem}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>

                    </section>
                </div>
            </div>

            <footer className="mt-16 pt-8 border-t border-app-soft/10 dark:border-app-accent/10 flex flex-col md:flex-row justify-between items-center gap-4 text-app-muted">
                <p className="text-[12px] font-medium">
                    © {new Date().getFullYear()} Bluvi. Proyecto académico sin ánimo de lucro.
                </p>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <button type="button" onClick={() => navigate('/privacidad')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Privacidad</button>
                    <button type="button" onClick={() => navigate('/terminos')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Términos</button>
                    <button type="button" onClick={() => navigate('/cookies')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Cookies</button>
                    <button type="button" onClick={() => navigate('/accesibilidad')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Accesibilidad</button>
                </nav>
            </footer>

            <BluAssistant />
        </div>
    );
};
