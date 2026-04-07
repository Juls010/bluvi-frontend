import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getHomeEventById } from '../../data/events';

const MODE_LABEL: Record<'online' | 'presencial' | 'hibrido', string> = {
    online: 'Online',
    presencial: 'Presencial',
    hibrido: 'Hibrido',
};

export const EventFlyer: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const event = getHomeEventById(eventId);

    if (!event) {
        return <Navigate to="/app/home" replace />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pb-8">
            <section className="rounded-3xl border border-white/65 bg-white/75 backdrop-blur-md shadow-sm p-6 md:p-8 animate-fade-in motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-bluvi-purple/55 mb-3">
                    Evento Bluvi
                </p>

                <h1 className="text-2xl md:text-4xl font-bold text-bluvi-purple leading-tight tracking-tight">
                    {event.title}
                </h1>

                <p className="text-sm md:text-base text-bluvi-purple/75 mt-3 leading-relaxed">
                    {event.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <article className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-bluvi-purple/45">Fecha</p>
                        <p className="text-sm font-semibold text-bluvi-purple mt-1">{event.dateLabel}</p>
                    </article>
                    <article className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-bluvi-purple/45">Lugar</p>
                        <p className="text-sm font-semibold text-bluvi-purple mt-1">{event.place}</p>
                    </article>
                    <article className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-bluvi-purple/45">Formato</p>
                        <p className="text-sm font-semibold text-bluvi-purple mt-1">{MODE_LABEL[event.mode]}</p>
                    </article>
                </div>
            </section>

            <section className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md shadow-sm p-6 md:p-7 mt-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-bluvi-purple/65 mb-4">
                    Que veremos
                </h2>

                <ul className="space-y-3">
                    {event.agenda.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm md:text-base text-bluvi-purple/80 leading-relaxed">
                            <span className="mt-2 w-2 h-2 rounded-full bg-bluvi-purple/40 flex-shrink-0" aria-hidden="true" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-6">
                    <Link
                        to="/app/home"
                        className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/25"
                        style={{ background: 'linear-gradient(135deg, #3f4292, #6366c7)' }}
                    >
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </div>
    );
};
