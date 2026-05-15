import React, { useEffect, useState } from 'react';
import {
    useNavigate } from 'react-router-dom';
import { ArrowLeftIcon,
    ChatTextIcon,
    FlagIcon,
    ProhibitIcon,
    SpinnerGapIcon,
    UserMinusIcon
} from '@phosphor-icons/react';
import { getBlockedUsers, unblockUser, getMyReports } from '../../services/chat.service';
import { ConfirmModal } from '../../components/ConfirmModal';
import { toastQueue } from '../../components/Toast/GlobalToast';

export const ReportsAndBlocks: React.FC = () => {
    const navigate = useNavigate();
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblockId, setUnblockId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

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

    const handleUnblockClick = (userId: number) => {
        setUnblockId(userId);
    };

    const confirmUnblock = async () => {
        if (unblockId === null) return;
        
        try {
            await unblockUser(unblockId);
            setBlockedUsers(prev => prev.filter(u => u.id !== unblockId));
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
                    className="inline-flex items-center gap-2 rounded-xl bg-app-surface-soft px-3 py-2 text-sm font-semibold text-app-primary hover:bg-app-surface-strong focus-visible:outline-none"
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

            {/* Bloqueos */}
            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-4">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <ProhibitIcon size={14} weight="bold" />
                    </span>
                    Bloqueos
                </h2>
                
                {loading ? (
                    <div className="flex items-center gap-3 py-4 text-app-muted text-sm italic">
                        <SpinnerGapIcon size={16} weight="bold" className="animate-spin" />
                        Cargando bloqueos...
                    </div>
                ) : blockedUsers.length > 0 ? (
                    <div className="space-y-3">
                        {blockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-app-surface-soft/50 rounded-2xl border border-app-soft hover:border-app-accent-soft transition-colors group">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user.main_photo || 'https://via.placeholder.com/120'} 
                                        alt="" 
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-app-soft"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-app-primary">{user.first_name} {user.last_name}</p>
                                        <p className="text-[10px] text-app-muted">Bloqueado el {new Date(user.blocked_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUnblockClick(user.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-app-accent-strong hover:bg-app-accent-soft/20 rounded-xl transition-all active:scale-95"
                                >
                                    <UserMinusIcon size={14} weight="bold" />
                                    Desbloquear
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 bg-app-surface-soft rounded-2xl flex items-center justify-center mx-auto mb-3 text-app-muted border border-app-soft">
                           <UserMinusIcon size={24} weight="bold" />
                        </div>
                        <p className="text-sm text-app-muted">No tienes personas bloqueadas.</p>
                    </div>
                )}
            </section>

            {/* Reportes */}
            <section className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6 py-5">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary flex items-center gap-2 mb-4">
                    <span className="text-app-accent-strong" aria-hidden="true">
                        <FlagIcon size={14} weight="bold" />
                    </span>
                    Reportes enviados
                </h2>
                
                {loading ? (
                    <div className="flex items-center gap-3 py-4 text-app-muted text-sm italic">
                        <SpinnerGapIcon size={16} weight="bold" className="animate-spin" />
                        Cargando reportes...
                    </div>
                ) : reports.length > 0 ? (
                    <div className="space-y-3">
                        {reports.map(report => (
                            <div key={report.id} className="p-4 bg-app-surface-soft/50 rounded-2xl border border-app-soft hover:border-orange-200 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-app-primary">
                                            Denuncia a {report.first_name} {report.last_name}
                                        </p>
                                        <p className="text-[10px] text-app-muted">
                                            Enviado el {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        En revisión
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 mt-3 p-3 bg-app-surface rounded-xl border border-app-soft">
                                    <ChatTextIcon size={14} weight="bold" className="text-app-muted mt-0.5" />
                                    <p className="text-xs text-app-secondary italic leading-relaxed">
                                        "{report.reason}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <div className="w-12 h-12 bg-app-surface-soft rounded-2xl flex items-center justify-center mx-auto mb-3 text-app-muted border border-app-soft">
                           <FlagIcon size={24} weight="bold" />
                        </div>
                        <p className="text-sm text-app-muted">Aún no has enviado reportes.</p>
                    </div>
                )}
            </section>

            <ConfirmModal 
                isOpen={unblockId !== null}
                title="Desbloquear usuario"
                description="¿Estás seguro de que deseas desbloquear a este usuario? Volveréis a poder interactuar si coincidís."
                confirmText="Desbloquear"
                onConfirm={confirmUnblock}
                onCancel={() => setUnblockId(null)}
            />
        </article>
    );
};
