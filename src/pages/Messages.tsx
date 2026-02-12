import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles } from 'lucide-react';

interface MatchUser {
    id: number;
    name: string;
    image: string;
    isNew?: boolean;
}

interface ChatItem {
    id: number;
    name: string;
    lastMsg: string;
    time: string;
    unread: boolean;
    image: string;
}

const NEW_MATCHES: MatchUser[] = [
    { id: 1, name: 'Lucila',  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', isNew: true },
    { id: 2, name: 'Marc',    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', isNew: true },
    { id: 3, name: 'Noa',     image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop' },
    { id: 4, name: 'Javier',  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
];

const CHATS: ChatItem[] = [
    { id: 1, name: 'Lucila López Quesada', lastMsg: '¿Te gustan las pelis de miedo?',              time: '20:08', unread: true,  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop' },
    { id: 2, name: 'Esther Medina',        lastMsg: 'El kiwi, además de una fruta, es un ave 🤨', time: '17:24', unread: false, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { id: 3, name: 'Marcos Vidal',         lastMsg: 'Oye, ¿quedamos el sábado?',                  time: 'Ayer',  unread: false, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
];

const MatchesSection: React.FC = () => (
    <section aria-labelledby="matches-heading">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-bluvi-purple/60" aria-hidden="true" />
                <h2
                    id="matches-heading"
                    className="text-[11px] font-bold text-bluvi-purple uppercase tracking-[0.2em] opacity-70"
                >
                    Nuevas conexiones
                </h2>
            </div>
            <span
                aria-label={`${NEW_MATCHES.filter(m => m.isNew).length} matches nuevos`}
                className="text-[11px] font-semibold text-bluvi-purple/50 bg-bluvi-light-purple/30 px-2.5 py-1 rounded-full"
            >
                {NEW_MATCHES.filter(m => m.isNew).length} nuevos
            </span>
        </div>

        <div
            role="list"
            aria-label="Nuevos matches"
            className="flex overflow-x-auto gap-3 scrollbar-hide py-3 -mx-1 px-1"
        >
            {NEW_MATCHES.map((user) => (
                <Link
                    key={user.id}
                    to={`/app/chat/${user.id}`}
                    role="listitem"
                    aria-label={`Abrir chat con ${user.name}${user.isNew ? ', match nuevo' : ''}`}
                    className="flex-shrink-0 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40 rounded-3xl"
                >
                    <div className="relative w-28">
                        <div className="w-28 h-36 rounded-3xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 rounded-3xl"
                                style={{ background: 'linear-gradient(to top, rgba(63,66,146,0.55) 0%, transparent 55%)' }}
                            />
                            <p className="absolute bottom-2.5 left-0 right-0 text-center text-white text-[12px] font-semibold drop-shadow-sm">
                                {user.name}
                            </p>
                        </div>

                        {user.isNew && (
                            <span
                                aria-hidden="true"
                                className="absolute -top-1.5 -right-1.5 text-[9px] font-bold uppercase tracking-wide bg-bluvi-purple text-white px-2 py-0.5 rounded-full shadow-sm"
                            >
                                Nuevo
                            </span>
                        )}

                        <span
                            aria-hidden="true"
                            className="absolute bottom-2.5 right-2 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white"
                        />
                    </div>
                </Link>
            ))}
        </div>
    </section>
);

const ChatsSection: React.FC = () => (
    <section aria-labelledby="chats-heading">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-gray-400" aria-hidden="true" />
                <h2
                    id="chats-heading"
                    className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]"
                >
                    Conversaciones
                </h2>
            </div>
            {CHATS.some(c => c.unread) && (
                <span
                    aria-label="Tienes mensajes sin leer"
                    className="text-[11px] font-semibold text-white bg-bluvi-purple px-2.5 py-1 rounded-full shadow-sm"
                >
                    {CHATS.filter(c => c.unread).length} sin leer
                </span>
            )}
        </div>

        <ul aria-label="Lista de conversaciones" className="flex flex-col gap-2.5">
            {CHATS.map((chat) => (
                <li key={chat.id}>
                    <Link
                        to={`/app/chat/${chat.id}`}
                        aria-label={`
                            Chat con ${chat.name}.
                            Último mensaje: ${chat.lastMsg}.
                            ${chat.unread ? 'Tienes mensajes sin leer.' : ''}
                            ${chat.time}
                        `}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md hover:bg-white/65 transition-all duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40"
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={chat.image}
                                alt=""          
                                className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                                loading="lazy"
                            />

                            <span
                                aria-hidden="true"
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full ring-2 ring-white"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline gap-2">
                                <h3 className={`text-[15px] truncate transition-colors duration-200 ${chat.unread ? 'font-bold text-bluvi-purple' : 'font-semibold text-gray-600 group-hover:text-bluvi-purple'}`}>
                                    {chat.name}
                                </h3>
                                <span className="text-[11px] text-gray-400 flex-shrink-0 font-medium">
                                    {chat.time}
                                </span>
                            </div>
                            <p className={`text-[13px] truncate mt-0.5 ${chat.unread ? 'text-gray-600 font-medium' : 'text-gray-400 italic'}`}>
                                {chat.lastMsg}
                            </p>
                        </div>

                        {chat.unread && (
                            <div
                                aria-hidden="true"
                                className="w-3 h-3 rounded-full bg-bluvi-purple flex-shrink-0 shadow-[0_0_8px_rgba(63,66,146,0.6)]"
                            />
                        )}
                    </Link>
                </li>
            ))}
        </ul>
    </section>
);


export const Messages: React.FC = () => (
    <div className="w-full max-w-4xl mx-auto px-6 py-2 animate-fade-in motion-reduce:animate-none">

        <header className="mb-4 -my-10">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                Mensajes
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
                {NEW_MATCHES.filter(m => m.isNew).length} conexiones nuevas esperándote
            </p>
        </header>

        <main className="flex flex-col gap-10">
            <MatchesSection />
            <div aria-hidden="true" className="flex items-center gap-3 -my-5">
                <div className="flex-1 h-px bg-bluvi-light-purple/30" />
                <span className="text-[10px] font-semibold text-bluvi-purple/30 uppercase tracking-widest">
                    activas
                </span>
                <div className="flex-1 h-px bg-bluvi-light-purple/30" />
            </div>

            <ChatsSection />
        </main>
    </div>
);