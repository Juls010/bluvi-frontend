import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles } from 'lucide-react';
import {
    getIncomingMatchRequests,
    getMyMatches,
    respondToMatchRequest,
    type IncomingMatchRequest,
    type MatchItem,
} from '../services/match.service';
import { connectRealtime, disconnectRealtime } from '../services/realtime.service';

const formatTime = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
};

const MatchesSection: React.FC<{ requests: IncomingMatchRequest[]; onRespond: (id: number, action: 'accept' | 'reject') => void }> = ({ requests, onRespond }) => (
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
                aria-label={`${requests.length} solicitudes nuevas`}
                className="text-[11px] font-semibold text-bluvi-purple/50 bg-bluvi-light-purple/30 px-2.5 py-1 rounded-full"
            >
                {requests.length} nuevas
            </span>
        </div>

        <div role="list" aria-label="Solicitudes de conexión" className="flex flex-col gap-3 py-3">
            {requests.length === 0 && (
                <p className="text-sm text-gray-500">No tienes solicitudes pendientes ahora mismo.</p>
            )}

            {requests.map((request) => (
                <div key={request.id_request} className="rounded-2xl border border-bluvi-light-purple/40 bg-white/70 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src={request.main_photo || 'https://via.placeholder.com/120'}
                            alt={request.first_name}
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-bluvi-purple truncate">
                                {request.first_name} {request.last_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatTime(request.created_at)}</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-3">"{request.icebreaker_message}"</p>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => onRespond(request.id_request, 'reject')}
                            className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                        >
                            Rechazar
                        </button>
                        <button
                            onClick={() => onRespond(request.id_request, 'accept')}
                            className="flex-1 rounded-xl bg-bluvi-purple py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

const ChatsSection: React.FC<{ matches: MatchItem[] }> = ({ matches }) => (
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
            {matches.length > 0 && (
                <span
                    aria-label={`Tienes ${matches.length} matches activos`}
                    className="text-[11px] font-semibold text-white bg-bluvi-purple px-2.5 py-1 rounded-full shadow-sm"
                >
                    {matches.length} activas
                </span>
            )}
        </div>

        <ul aria-label="Lista de conversaciones" className="flex flex-col gap-2.5">
            {matches.map((match) => (
                <li key={match.id_request}>
                    <Link
                        to={`/app/chat/${match.id_user}`}
                        aria-label={`
                            Chat con ${match.first_name} ${match.last_name}.
                            Mensaje inicial: ${match.icebreaker_message}
                        `}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md hover:bg-white/65 transition-all duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40"
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={match.main_photo || 'https://via.placeholder.com/120'}
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
                                <h3 className="text-[15px] truncate transition-colors duration-200 font-semibold text-gray-600 group-hover:text-bluvi-purple">
                                    {match.first_name} {match.last_name}
                                </h3>
                                <span className="text-[11px] text-gray-400 flex-shrink-0 font-medium">
                                    {formatTime(match.responded_at || match.created_at)}
                                </span>
                            </div>
                            <p className="text-[13px] truncate mt-0.5 text-gray-400 italic">
                                {match.icebreaker_message}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}

            {matches.length === 0 && (
                <li className="text-sm text-gray-500">Aun no tienes conversaciones activas.</li>
            )}
        </ul>
    </section>
);

export const Messages: React.FC = () => {
    const [requests, setRequests] = useState<IncomingMatchRequest[]>([]);
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }

        try {
            const [incoming, accepted] = await Promise.all([
                getIncomingMatchRequests(),
                getMyMatches(),
            ]);
            setRequests(incoming);
            setMatches(accepted);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadData(true);

        const intervalId = window.setInterval(() => {
            loadData();
        }, 15000);

        const socket = connectRealtime();

        const handleRealtimeUpdate = () => {
            loadData();
        };

        socket?.on('match:request:new', handleRealtimeUpdate);
        socket?.on('match:accepted', handleRealtimeUpdate);

        return () => {
            window.clearInterval(intervalId);
            socket?.off('match:request:new', handleRealtimeUpdate);
            socket?.off('match:accepted', handleRealtimeUpdate);
            disconnectRealtime();
        };
    }, []);

    const handleRespond = async (idRequest: number, action: 'accept' | 'reject') => {
        try {
            await respondToMatchRequest(idRequest, action);
            await loadData();
        } catch (error) {
            console.error('Error respondiendo solicitud:', error);
        }
    };

    if (loading) {
        return <div className="pt-16 text-center text-bluvi-purple font-medium">Cargando mensajes...</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-2 animate-fade-in motion-reduce:animate-none">

        <header className="mb-4 -my-10">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                Mensajes
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
                {requests.length} solicitudes nuevas esperándote
            </p>
        </header>

        <main className="flex flex-col gap-10">
            <MatchesSection requests={requests} onRespond={handleRespond} />
            <div aria-hidden="true" className="flex items-center gap-3 -my-5">
                <div className="flex-1 h-px bg-bluvi-light-purple/30" />
                <span className="text-[10px] font-semibold text-bluvi-purple/30 uppercase tracking-widest">
                    activas
                </span>
                <div className="flex-1 h-px bg-bluvi-light-purple/30" />
            </div>

            <ChatsSection matches={matches} />
        </main>
    </div>
    );
};