import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    ChatTextIcon,
    FlagIcon,
    ProhibitIcon,
    SpinnerGapIcon,
    UserMinusIcon
} from '@phosphor-icons/react';
import { getBlockedUsers, unblockUser, getMyReports } from '../../services/chat.service';
import { ConfirmModal } from '../../components/ConfirmModal';
import { toastQueue } from '../../components/Toast/GlobalToast';

type BlockedUser = {
    id: number;
    first_name: string;
    last_name: string;
    main_photo?: string | null;
    blocked_at: string;
};

type UserReport = {
    id: number;
    first_name: string;
    last_name: string;
    reason: string;
    created_at: string;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString('es-ES');

export const ReportsAndBlocks: React.FC = () => {
    const navigate = useNavigate();
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblockId, setUnblockId] = useState<number | null>(null);

    const userToUnblock = blockedUsers.find(user => user.id === unblockId);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [blockedData, reportsData] = await Promise.all([
                    getBlockedUsers(),
                    getMyReports()
                ]);
                setBlockedUsers(blockedData);
                setReports(reportsData);
            } catch (error) {
                console.error('Error loading reports and blocks:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    const handleUnblockClick = (userId: number) => {
        setUnblockId(userId);
    };

    const confirmUnblock = async () => {
        if (unblockId === null) return;

        try {
            await unblockUser(unblockId);
            setBlockedUsers(prev => prev.filter(user => user.id !== unblockId));
            toastQueue.add(
                { message: 'Usuario desbloqueado correctamente', type: 'success' },
                { timeout: 4000 }
            );
        } catch (error) {
            console.error('Error unblocking user:', error);
            toastQueue.add(
                { message: 'No se pudo desbloquear al usuario.', type: 'error' },
                { timeout: 5000 }
            );
        } finally {
            setUnblockId(null);
        }
    };

    return (
        <article className="w-full max-w-3xl mx-auto p-4 md:p-0 pb-16 animate-fade-in motion-reduce:animate-none space-y-6">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/app/settings')}
                    className="inline-flex items-center gap-2 rounded-xl border border-app-soft bg-app-surface-soft px-3 py-2 text-sm font-semibold text-app-primary transition-colors hover:border-app-strong hover:bg-app-surface-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/70 focus-visible:ring-offset-2"
                >
                    <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
                    Volver a ajustes
                </button>
            </div>

            <header>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-app-primary">Reportes y bloqueos</h1>
                <p className="text-sm text-app-secondary mt-2">
                    Gestiona tus reportes enviados y las personas que has bloqueado.
                </p>
            </header>

            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5" aria-labelledby="blocked-users-heading">
                <h2 id="blocked-users-heading" className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-4">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <ProhibitIcon size={14} weight="bold" />
                    </span>
                    Bloqueos
                </h2>

                {loading ? (
                    <div className="flex items-center gap-3 py-4 text-app-muted text-sm italic" role="status" aria-live="polite">
                        <SpinnerGapIcon size={16} weight="bold" className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                        Cargando bloqueos...
                    </div>
                ) : blockedUsers.length > 0 ? (
                    <ul className="space-y-3" aria-label="Personas bloqueadas">
                        {blockedUsers.map(user => (
                            <li key={user.id} className="flex items-center justify-between gap-3 p-3 bg-app-surface-soft/50 rounded-2xl border border-app-soft hover:border-app-accent transition-colors">
                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        src={user.main_photo || 'https://via.placeholder.com/120'}
                                        alt={`Foto de ${user.first_name} ${user.last_name}`}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-app-soft"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-app-primary truncate">{user.first_name} {user.last_name}</p>
                                        <p className="text-[10px] text-app-muted">Bloqueado el {formatDate(user.blocked_at)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleUnblockClick(user.id)}
                                    aria-label={`Desbloquear a ${user.first_name} ${user.last_name}`}
                                    className="flex shrink-0 items-center gap-2 px-4 py-2 text-xs font-bold text-app-accent-strong hover:bg-app-surface-strong rounded-xl border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/70 focus-visible:ring-offset-2"
                                >
                                    <UserMinusIcon size={14} weight="bold" aria-hidden="true" />
                                    Desbloquear
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 bg-app-surface-soft rounded-2xl flex items-center justify-center mx-auto mb-3 text-app-muted border border-app-soft" aria-hidden="true">
                            <UserMinusIcon size={24} weight="bold" />
                        </div>
                        <p className="text-sm text-app-muted">No tienes personas bloqueadas.</p>
                    </div>
                )}
            </section>

            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5" aria-labelledby="reports-heading">
                <h2 id="reports-heading" className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-4">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <FlagIcon size={14} weight="bold" />
                    </span>
                    Reportes enviados
                </h2>

                {loading ? (
                    <div className="flex items-center gap-3 py-4 text-app-muted text-sm italic" role="status" aria-live="polite">
                        <SpinnerGapIcon size={16} weight="bold" className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                        Cargando reportes...
                    </div>
                ) : reports.length > 0 ? (
                    <ul className="space-y-3" aria-label="Reportes enviados">
                        {reports.map(report => (
                            <li key={report.id} className="p-4 bg-app-surface-soft/50 rounded-2xl border border-app-soft hover:border-orange-200 transition-colors">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-app-primary">
                                            Denuncia a {report.first_name} {report.last_name}
                                        </p>
                                        <p className="text-[10px] text-app-muted">
                                            Enviado el {formatDate(report.created_at)}
                                        </p>
                                    </div>
                                    <span className="shrink-0 px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        En revisión
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 mt-3 p-3 bg-app-surface rounded-xl border border-app-soft">
                                    <ChatTextIcon size={14} weight="bold" className="text-app-muted mt-0.5" aria-hidden="true" />
                                    <p className="text-xs text-app-secondary italic leading-relaxed">
                                        "{report.reason}"
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 bg-app-surface-soft rounded-2xl flex items-center justify-center mx-auto mb-3 text-app-muted border border-app-soft" aria-hidden="true">
                            <FlagIcon size={24} weight="bold" />
                        </div>
                        <p className="text-sm text-app-muted">Aún no has enviado reportes.</p>
                    </div>
                )}
            </section>

            <ConfirmModal
                isOpen={unblockId !== null}
                title="Desbloquear usuario"
                description={`¿Estás seguro de que deseas desbloquear${userToUnblock ? ` a ${userToUnblock.first_name} ${userToUnblock.last_name}` : ' a este usuario'}? Volveréis a poder interactuar si coincidís.`}
                confirmText="Desbloquear"
                onConfirm={confirmUnblock}
                onCancel={() => setUnblockId(null)}
            />
        </article>
    );
};
