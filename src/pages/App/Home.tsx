import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversations, type ConversationItem } from '../../services/chat.service';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);

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
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-bluvi-purple/65 bg-bluvi-light-purple/30 px-3 py-1.5 rounded-full mb-5 select-none"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-bluvi-purple/40 inline-block" />
                    Tu espacio seguro
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-bluvi-purple leading-[1.1] tracking-tight">
                    Bienvenida, {displayName}
                </h1>
                <p className="text-bluvi-purple/70 text-base md:text-lg mt-3 max-w-2xl">
                    Elige como quieres empezar hoy. Todo esta pensado para navegar con calma y sin ruido.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-5">
                <div className="space-y-5">
                    <section className="rounded-3xl border border-white/60 bg-white/65 backdrop-blur-md shadow-sm p-5 md:p-6">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65 mb-4">
                            Acciones rapidas
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                onClick={() => navigate('/app/discovery')}
                                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/25"
                                style={{ background: 'linear-gradient(135deg, #3f4292, #6366c7)' }}
                            >
                                <span className="block text-[11px] uppercase tracking-widest text-white/70 mb-1">Buscar</span>
                                Explorar personas
                            </button>

                            <button
                                onClick={() => navigate('/app/messages')}
                                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-bluvi-purple bg-white/85 border border-white/80 shadow-sm hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/25"
                            >
                                <span className="block text-[11px] uppercase tracking-widest text-bluvi-purple/50 mb-1">Mensajes</span>
                                Revisar conversaciones
                            </button>

                            <button
                                onClick={() => navigate('/app/profile')}
                                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-bluvi-purple bg-white/85 border border-white/80 shadow-sm hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/25"
                            >
                                <span className="block text-[11px] uppercase tracking-widest text-bluvi-purple/50 mb-1">Perfil</span>
                                Ajustar mi espacio
                            </button>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-white/60 bg-white/55 backdrop-blur-md shadow-sm p-5 md:p-6">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65 mb-3">
                            Qué puedes hacer ahora
                        </h2>
                        <p className="text-sm md:text-base text-bluvi-purple/80 leading-relaxed max-w-2xl">
                            Empieza por una sola accion si hoy prefieres baja estimulacion. Desde Ajustes puedes cambiar contraste y movimiento cuando lo necesites.
                        </p>
                    </section>

                    <section className="rounded-3xl border border-white/60 bg-white/55 backdrop-blur-md shadow-sm p-5 md:p-6">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65 mb-4">
                            Noticias y eventos
                        </h2>

                        <div className="space-y-3">
                            {[
                                {
                                    title: 'Nueva forma de descubrir perfiles',
                                    text: 'Hemos simplificado el inicio para que puedas entrar directamente a explorar sin ruido visual.',
                                    meta: 'Hoy',
                                },
                                {
                                    title: 'Sesión de comunidad esta semana',
                                    text: 'Próximo encuentro de bienvenida para personas nuevas y curiosas sobre Bluvi.',
                                    meta: 'Jueves · 19:00',
                                },
                                {
                                    title: 'Ajustes pensados para ti',
                                    text: 'Contraste, movimiento y navegación clara ya están disponibles desde el menú superior.',
                                    meta: 'Siempre disponible',
                                },
                            ].map((item) => (
                                <article key={item.title} className="border-l-2 border-bluvi-purple/20 pl-4 py-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bluvi-purple/45">
                                        {item.meta}
                                    </p>
                                    <h3 className="text-sm font-bold text-bluvi-purple mt-1">{item.title}</h3>
                                    <p className="text-sm text-bluvi-purple/70 mt-1 leading-relaxed">{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-3xl border border-white/60 bg-white/65 backdrop-blur-md shadow-sm p-5 md:p-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65">
                                Notificaciones
                            </h2>
                            <span className="text-xs font-semibold text-bluvi-purple/60 bg-bluvi-light-purple/25 px-2.5 py-1 rounded-full">
                                {unreadNotifications.reduce((total, conversation) => total + (conversation.unread_count || 0), 0)} sin leer
                            </span>
                        </div>

                        {unreadNotifications.length > 0 ? (
                            <div className="space-y-3">
                                {unreadNotifications.map((conversation) => (
                                    <button
                                        key={conversation.match_request_id}
                                        onClick={() => navigate('/app/messages')}
                                        className="w-full text-left border-l-2 border-green-500/70 pl-4 py-2 hover:bg-white/50 rounded-r-2xl transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-bluvi-purple">
                                                {conversation.first_name} {conversation.last_name}
                                            </p>
                                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                                        </div>
                                        <p className="text-sm text-bluvi-purple/70 mt-1">
                                            Tienes {conversation.unread_count} mensaje{conversation.unread_count > 1 ? 's' : ''} sin leer.
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-bluvi-purple/70 leading-relaxed">
                                Ahora mismo no hay mensajes pendientes. Cuando llegue algo nuevo, verás el punto verde en Mensajes.
                            </p>
                        )}
                    </section>

                    <section className="rounded-3xl border border-white/60 bg-white/55 backdrop-blur-md shadow-sm p-5 md:p-6">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65 mb-3">
                            Recordatorio suave
                        </h2>
                        <p className="text-sm text-bluvi-purple/80 leading-relaxed">
                            Tu espacio seguro sigue disponible en todo momento. Avanza a tu ritmo y vuelve aqui cuando quieras reorientarte.
                        </p>
                    </section>
                </aside>
            </div>
        </div>
    );
};