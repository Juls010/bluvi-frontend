import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ban, Flag } from 'lucide-react';

export const ReportsAndBlocks: React.FC = () => {
    const navigate = useNavigate();

    return (
        <article className="w-full max-w-3xl mx-auto p-4 md:p-0 pb-16 animate-fade-in motion-reduce:animate-none space-y-6">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/app/settings')}
                    className="inline-flex items-center gap-2 rounded-xl border border-app-soft bg-app-surface-soft px-3 py-2 text-sm font-semibold text-app-primary hover:bg-app-surface-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-light-purple/35"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Volver a ajustes
                </button>
            </div>

            <header>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-app-primary">Reportes y bloqueos</h1>
                <p className="text-sm text-app-secondary mt-2">
                    Gestiona tus reportes enviados y las personas que has bloqueado.
                </p>
            </header>

            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-3">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <Ban size={14} />
                    </span>
                    Bloqueos
                </h2>
                <p className="text-sm text-app-muted">
                    Aun no tienes personas bloqueadas.
                </p>
            </section>

            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-3">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <Flag size={14} />
                    </span>
                    Reportes enviados
                </h2>
                <p className="text-sm text-app-muted">
                    Aun no has enviado reportes.
                </p>
            </section>
        </article>
    );
};
