import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversations, type ConversationItem } from '../../services/chat.service';
import { useNotifications } from '../../context/NotificationContext';
import { HOME_EVENTS } from '../../data/events';
import { ArrowRight, Clock } from 'lucide-react';

import { BluAssistant } from '../../components/BluAssistant';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const { unreadMessages, pendingMatchRequests, hasNotifications, pendingRequestNames } = useNotifications();

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

    const unreadNotifications = useMemo(() => {
        return conversations
            .filter((conversation) => (conversation.unread_count || 0) > 0)
            .slice(0, 4);
    }, [conversations]);

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

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-8">
            <section className="pt-1 pb-6 animate-fade-in motion-reduce:animate-none">
                <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-app-secondary bg-app-pill px-3 py-1.5 rounded-full mb-5 select-none"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-app-home-safe-dot inline-block" />
                    Tu espacio seguro
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-app-primary leading-[1.1] tracking-tight">
                    Bienvenida, {displayName}
                </h1>
                <p className="text-app-secondary text-base md:text-lg mt-3 max-w-2xl">
                    Elige como quieres empezar hoy. Todo esta pensado para navegar con calma y sin ruido.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-5">
                <div className="space-y-5">
                    <section
                        className="bg-app-surface backdrop-blur-md border border-app-soft rounded-[22px] p-5"
                        aria-labelledby="actions-title"
                    >
                        <h2
                        id="actions-title"
                        className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary mb-4"
                        >
                        Por dónde empezar
                        </h2>
            
                        <button
                        type="button"
                        onClick={() => navigate('/app/discovery')}
                        className="
                            w-full flex items-center justify-between gap-4
                            bg-app-pill hover:bg-bluvi-purple/18 dark:hover:bg-app-surface-strong
                            border border-[#7F77DD]/20 dark:border-app-strong
                            rounded-2xl px-5 py-4 mb-3 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30
                        "
                        >
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-app-secondary mb-1">
                            Descubrir
                            </p>
                            <p className="text-[16px] font-extrabold text-app-primary leading-tight">
                            Explorar personas
                            </p>
                            <p className="text-[12.5px] text-app-muted mt-1 leading-relaxed">
                            Perfiles nuevos esperando conectar contigo
                            </p>
                        </div>
                        <div
                            className="w-9 h-9 rounded-full bg-[#7F77DD] bg-app-accent-gradient-dark flex items-center justify-center shrink-0"
                            aria-hidden="true"
                        >
                            <ArrowRight size={14} className="text-app-on-accent" />
                        </div>
                        </button>
            
                        <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Otras acciones">
                        <button
                            type="button"
                            onClick={() => navigate('/app/messages')}
                            className="
                            bg-app-surface-soft hover:bg-app-surface-strong
                            border border-app-soft
                            rounded-2xl px-4 py-3.5 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30
                            "
                            >
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-app-muted mb-1">
                            Mensajes
                            </p>
                            <p className="text-[13.5px] font-bold text-app-primary">
                            Revisar conversaciones
                            </p>
                        </button>
            
                        <button
                            type="button"
                            onClick={() => navigate('/app/profile')}
                            className="
                            bg-app-surface-soft hover:bg-app-surface-strong
                            border border-app-soft
                            rounded-2xl px-4 py-3.5 text-left
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm
                            focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7F77DD]/30
                            "
                            >
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-app-muted mb-1">
                            Perfil
                            </p>
                            <p className="text-[13.5px] font-bold text-app-primary">
                            Ajustar mi espacio
                            </p>
                        </button>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-app-soft bg-app-surface-soft backdrop-blur-md shadow-sm p-5 md:p-6">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-app-secondary mb-4">
                            Noticias y eventos
                        </h2>

                        <div className="space-y-3">
                            {HOME_EVENTS.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/app/events/${item.id}`}
                                    className="block border-l-2 border-app-strong pl-4 py-2 rounded-r-2xl hover:bg-app-surface hover:shadow-sm hover:translate-x-0.5 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                                >
                                    <article>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-muted">
                                            {item.meta}
                                        </p>
                                        <h3 className="text-sm font-bold text-app-primary mt-1">{item.title}</h3>
                                        <p className="text-sm text-app-secondary mt-1 leading-relaxed">{item.text}</p>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-app-muted mt-2">
                                            Ver informacion
                                        </p>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="flex flex-col gap-5" aria-label="Panel lateral">
                    <section className="bg-app-surface backdrop-blur-md border border-app-soft rounded-[22px] p-5" aria-labelledby="notif-title">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h2 id="notif-title" className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary">
                                Notificaciones
                            </h2>
                            <span className="inline-flex items-center gap-2 text-xs font-semibold text-app-secondary bg-app-pill px-2.5 py-1 rounded-full">
                                {hasNotifications && <span className="w-2.5 h-2.5 rounded-full bg-green-500" aria-hidden="true" />}
                                {unreadMessages + pendingMatchRequests} sin leer
                            </span>
                        </div>

                        {unreadNotifications.length > 0 ? (
                            <div className="space-y-3">
                                {unreadNotifications.map((conversation) => (
                                    <button
                                        key={conversation.chat_id}
                                        onClick={() => navigate('/app/messages')}
                                        className="w-full text-left border-l-2 border-green-500/70 pl-4 py-2 hover:bg-app-surface-soft rounded-r-2xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-app-primary">
                                                {conversation.first_name} {conversation.last_name}
                                            </p>
                                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                                        </div>
                                        <p className="text-sm text-app-secondary mt-1">
                                            Tienes {conversation.unread_count} mensaje{conversation.unread_count > 1 ? 's' : ''} sin leer.
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : pendingMatchRequests > 0 ? (
                            <button
                                onClick={() => navigate('/app/messages')}
                                className="w-full text-left rounded-2xl border border-green-500/20 bg-green-500/8 px-4 py-3 hover:bg-green-500/12 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/20"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-app-primary">
                                        {pendingRequestNames[0] ? `${pendingRequestNames[0]} te quiere conocer` : 'Tienes una nueva solicitud de icebreaking'}
                                    </p>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                                </div>
                                <p className="text-sm text-app-secondary mt-1">
                                    Hay {pendingMatchRequests} solicitud{pendingMatchRequests > 1 ? 'es' : ''} pendiente{pendingMatchRequests > 1 ? 's' : ''} esperando tu respuesta.
                                </p>
                            </button>
                        ) : (
                            <p className="text-sm text-app-secondary leading-relaxed">
                                Cuando llegue algo nuevo lo verás aquí. Por ahora, todo tranquilo.
                            </p>
                        )}
                    </section>

                    
                    
                    <aside className="bg-app-surface-soft border border-app-soft rounded-[22px] p-5" aria-label="Recordatorio de ritmo">
                        <div className="w-8 h-8 rounded-[9px] bg-app-pill flex items-center justify-center mb-3" aria-hidden="true">
                            <Clock size={15} className="text-app-accent" />
                        </div>
                        <p className="text-[13px] font-extrabold text-app-primary mb-1.5">
                            Avanza a tu ritmo
                        </p>
                        <p className="text-[12.5px] text-app-secondary leading-relaxed">
                            Una sola acción es suficiente para hoy. Tu espacio sigue aquí cuando vuelvas.
                        </p>
                    </aside>
                    
                </aside>
            </div>

            <BluAssistant />
        </div>
    );
};
