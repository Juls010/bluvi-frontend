import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversations, type ConversationItem } from '../../services/chat.service';
import { useNotifications } from '../../context/NotificationContext';
import { HOME_EVENTS } from '../../data/events';
import { ArrowRight, Mail, Waves, MessagesSquare, User, ChevronLeft, ChevronRight, Bell, MessageSquareHeart } from 'lucide-react';

import { BluAssistant } from '../../components/BluAssistant';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const { unreadMessages, pendingMatchRequests, hasNotifications, pendingRequestNames } = useNotifications();
    
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const activityMessage = useMemo(() => {
        if (!hasNotifications && pendingMatchRequests === 0) {
            return "Todo está en calma por aquí. Disfruta de tu espacio.";
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

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const result = await getConversations();
                setConversations(result);
            } catch (error) {
                console.error('Error cargando notificaciones de mensajes:', error);
            }
        };

        loadConversations();
    }, []);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollPosition = scrollRef.current.scrollLeft;
            const width = scrollRef.current.offsetWidth;
            if (width > 0) {
                const newIndex = Math.round(scrollPosition / width);
                setCurrentEventIndex(newIndex);
            }
        }
    };

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-12">
            <header className="pt-1 pb-6 animate-fade-in motion-reduce:animate-none">
                <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-1.5 text-[11.5px] font-bold tracking-widest uppercase text-app-secondary bg-app-pill px-3 py-1.5 rounded-full mb-5 select-none"
                >
                    <Waves size={13} className="text-app-accent" />
                    Tu espacio de calma
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-app-primary leading-[1.1] tracking-tight">
                    Bienvenida, <span className="text-app-accent">{displayName}</span>
                </h1>
                <p className="text-app-secondary text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
                    ¿Qué te pide el cuerpo hoy? Navega a tu ritmo, sin presiones. Todo está pensado para ser tu refugio sensorial.
                </p>

                <button 
                    onClick={() => navigate('/app/messages')}
                    aria-label={`Actividad: ${activityMessage}. Pulsa para ir a mensajes.`}
                    className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-app-surface-soft/40 backdrop-blur-md border border-app-soft/60 dark:border-app-accent/20 hover:bg-app-surface-soft/60 hover:border-app-accent/30 transition-all group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/30"
                >
                    <div className="relative" aria-hidden="true">
                        <Bell size={18} className={`${hasNotifications || pendingMatchRequests > 0 ? 'text-app-accent' : 'text-app-muted'}`} />
                        {(hasNotifications || pendingMatchRequests > 0) && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-app-surface-solid animate-pulse" />
                        )}
                    </div>
                    <span className={`text-[14px] font-semibold ${hasNotifications || pendingMatchRequests > 0 ? 'text-app-primary' : 'text-app-secondary'}`}>
                        {activityMessage}
                    </span>
                    {(hasNotifications || pendingMatchRequests > 0) && (
                        <ArrowRight size={16} className="text-app-accent opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" aria-hidden="true" />
                    )}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-6">
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
                        className="
                            w-full flex items-center justify-between gap-4
                            bg-app-pill hover:bg-bluvi-purple/18 dark:hover:bg-app-surface-strong
                            border border-[#7F77DD]/20 dark:border-app-strong
                            rounded-[20px] px-6 py-5 mb-4 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/40
                        "
                        >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-app-accent-gradient flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105" aria-hidden="true">
                                <MessageSquareHeart size={22} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-app-secondary mb-1">
                                Descubrir
                                </p>
                                <p className="text-[17px] font-black text-app-primary leading-tight">
                                Explorar personas
                                </p>
                                <p className="text-[13.5px] text-app-muted mt-1.5 leading-relaxed">
                                Nuevas conexiones en tu misma sintonía
                                </p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-app-accent opacity-60" aria-hidden="true" />
                        </button>
            
                        <div className="grid grid-cols-2 gap-4" role="group" aria-label="Otras acciones">
                        <button
                            type="button"
                            onClick={() => navigate('/app/messages')}
                            aria-label="Ir a Mensajes. Revisar tus conversaciones."
                            className="
                            bg-app-surface-soft hover:bg-app-surface-strong
                            border border-app-soft
                            rounded-[20px] px-5 py-5 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/40
                            "
                            >
                            <div className="w-9 h-9 rounded-xl bg-app-pill flex items-center justify-center text-app-accent mb-4 shadow-sm" aria-hidden="true">
                                <MessagesSquare size={18} />
                            </div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-app-muted mb-1.5">
                            Mensajes
                            </p>
                            <p className="text-[14.5px] font-black text-app-primary">
                            Conversaciones
                            </p>
                        </button>
            
                        <button
                            type="button"
                            onClick={() => navigate('/app/profile')}
                            aria-label="Ir a mi Perfil. Ajustar mi espacio."
                            className="
                            bg-app-surface-soft hover:bg-app-surface-strong
                            border border-app-soft
                            rounded-[20px] px-5 py-5 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/40
                            "
                            >
                            <div className="w-9 h-9 rounded-xl bg-app-pill flex items-center justify-center text-app-accent mb-4 shadow-sm" aria-hidden="true">
                                <User size={18} />
                            </div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-app-muted mb-1.5">
                            Perfil
                            </p>
                            <p className="text-[14.5px] font-black text-app-primary">
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
                        <div className="flex items-center justify-between px-6 pt-6 pb-3">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-app-secondary">
                                Novedades Bluvi
                            </h2>
                            <div className="flex gap-2" role="group" aria-label="Controles de diapositivas">
                                {HOME_EVENTS.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollTo(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentEventIndex === index ? 'bg-app-accent w-5' : 'bg-app-accent/30 hover:bg-app-accent/50'}`}
                                        aria-label={`Ver novedad ${index + 1}`}
                                        aria-current={currentEventIndex === index ? 'true' : 'false'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div 
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
                        >
                            {HOME_EVENTS.map((item, index) => (
                                <Link
                                    key={item.id}
                                    to={`/app/events/${item.id}`}
                                    aria-label={`Novedad ${index + 1}: ${item.title}. Leer más.`}
                                    className="w-full flex-shrink-0 snap-center px-6 pt-2 focus-visible:outline-none"
                                >
                                    <article className="bg-app-surface/80 dark:bg-app-surface-strong/60 border border-app-soft/60 dark:border-app-accent/15 rounded-2xl p-6 hover:bg-app-surface dark:hover:bg-app-surface-strong transition-all shadow-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10.5px] font-black uppercase tracking-[0.2em] text-app-accent bg-app-accent/15 px-2.5 py-1 rounded">
                                                {item.meta}
                                            </span>
                                        </div>
                                        <h3 className="text-[17px] font-black text-app-primary leading-tight tracking-tight">{item.title}</h3>
                                        <p className="text-[14.5px] text-app-secondary mt-3 line-clamp-2 leading-relaxed">{item.text}</p>
                                        <div className="mt-5 flex items-center gap-2 text-[13px] font-black text-app-accent group-hover:gap-3 transition-all" aria-hidden="true">
                                            Saber más <ArrowRight size={14} />
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        <button 
                            onClick={() => scrollTo(currentEventIndex === 0 ? HOME_EVENTS.length - 1 : currentEventIndex - 1)}
                            aria-label="Anterior novedad"
                            className="absolute left-3 top-[62%] -translate-y-1/2 w-9 h-9 rounded-full bg-app-surface-card-strong/90 border border-app-soft shadow-md hidden md:flex items-center justify-center text-app-accent transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-app-surface-solid"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => scrollTo(currentEventIndex === HOME_EVENTS.length - 1 ? 0 : currentEventIndex + 1)}
                            aria-label="Siguiente novedad"
                            className="absolute right-3 top-[62%] -translate-y-1/2 w-9 h-9 rounded-full bg-app-surface-card-strong/90 border border-app-soft shadow-md hidden md:flex items-center justify-center text-app-accent transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-app-surface-solid"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </section>
                </div>

                <aside className="flex flex-col gap-6" aria-label="Panel lateral">
                    <section 
                        className="bg-app-surface-soft border border-app-soft rounded-[22px] p-6" 
                        aria-labelledby="support-title"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-app-pill flex items-center justify-center shadow-sm" aria-hidden="true">
                                <Mail size={18} className="text-app-accent" />
                            </div>
                            <h2 id="support-title" className="text-[11px] font-black uppercase tracking-[0.15em] text-app-secondary">
                                Soporte Humano
                            </h2>
                        </div>
                        <p className="text-[15px] font-black text-app-primary mb-2 tracking-tight">
                            ¿Necesitas ayuda?
                        </p>
                        <p className="text-[14px] text-app-secondary leading-relaxed mb-6 opacity-90">
                            Si tienes cualquier duda o te sientes saturada, escríbenos. Estamos aquí para ti.
                        </p>
                        <a 
                            href="mailto:hola@bluvi.com"
                            aria-label="Enviar un correo a soporte: hola@bluvi.com"
                            className="inline-flex items-center justify-center w-full bg-app-surface border border-app-soft/80 py-3 rounded-xl text-[13px] font-black text-app-accent hover:bg-app-surface-strong hover:border-app-accent/40 hover:shadow-md transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/20"
                        >
                            Hablar con Bluvi
                        </a>
                    </section>
                </aside>
            </div>

            <footer className="mt-16 pt-8 border-t border-app-soft/10 dark:border-app-accent/10 flex flex-col md:flex-row justify-between items-center gap-4 text-app-muted">
                <p className="text-[12px] font-medium ">
                    © {new Date().getFullYear()} Bluvi. Proyecto académico sin ánimo de lucro.
                </p>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <button onClick={() => navigate('/privacidad')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Privacidad</button>
                    <button onClick={() => navigate('/terminos')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Términos</button>
                    <button onClick={() => navigate('/cookies')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Cookies</button>
                    <button onClick={() => navigate('/accesibilidad')} className="text-[12px] font-bold hover:text-app-accent transition-colors">Accesibilidad</button>
                </nav>
            </footer>

            <BluAssistant />
        </div>
    );
};
