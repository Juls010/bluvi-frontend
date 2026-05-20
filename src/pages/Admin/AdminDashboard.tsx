import React, { useEffect, useMemo, useState } from 'react';
import { Ban, BarChart3, CheckCircle2, Crown, EyeOff, Flag, Loader2, LogOut, Megaphone, RefreshCw, Search, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService, type AdminMetricPoint, type AdminMetrics, type AdminOverview, type AdminReport, type AdminUser, type BadgeFilter } from '../../services/admin.service';
import { useAuth } from '../../context/AuthContext';
import { toastQueue } from '../../components/Toast/GlobalToast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Tooltip, TooltipTrigger, Button as AriaButton } from '../../components/Tooltip';
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';

type AdminTab = 'users' | 'reports' | 'metrics' | 'create-admin';
type ReportAction = 'dismiss' | 'warn' | 'remove-content';
type ReportStatusFilter = 'all' | 'pending' | 'dismissed' | 'warned' | 'content_removed';
type ReportContentFilter = 'all' | 'with-message' | 'user-only' | 'deleted-content';
type PendingConfirm =
    | { type: 'delete-user'; user: AdminUser; title: string; description: string; confirmText: string }
    | { type: 'report-action'; report: AdminReport; action: Exclude<ReportAction, 'dismiss'>; title: string; description: string; confirmText: string }
    | null;

const formatDate = (value?: string) => {
    if (!value) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

const StatTile: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="rounded-lg border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.07]">
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-app-muted">{label}</span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-bluvi-purple/10 text-bluvi-purple dark:bg-white/10 dark:text-[#D8D1FF]">
                {icon}
            </span>
        </div>
        <p className="mt-3 text-3xl font-black text-app-primary">{value}</p>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 ${
            active
                ? 'bg-bluvi-purple text-white shadow-md shadow-bluvi-purple/20'
                : 'bg-white/75 text-app-primary hover:bg-white dark:bg-white/[0.07] dark:hover:bg-white/[0.12]'
        }`}
    >
        {children}
    </button>
);

const REPORT_STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    dismissed: 'Desestimado',
    warned: 'Advertido',
    content_removed: 'Contenido borrado',
};

const REPORT_FILTER_OPTIONS: Array<{ value: ReportStatusFilter; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'dismissed', label: 'Desestimados' },
    { value: 'warned', label: 'Advertidos' },
    { value: 'content_removed', label: 'Contenido borrado' },
];

const REPORT_CONTENT_FILTER_OPTIONS: Array<{ value: ReportContentFilter; label: string }> = [
    { value: 'all', label: 'Todo tipo' },
    { value: 'with-message', label: 'Con mensaje' },
    { value: 'user-only', label: 'Solo usuario' },
    { value: 'deleted-content', label: 'Contenido eliminado' },
];

const compactNumber = (value: number) => new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const ChartCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <article className="rounded-lg border border-app-border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/10">
        <div className="mb-4 flex items-start justify-between gap-3">
            <div>
                <h2 className="text-base font-black text-app-primary">{title}</h2>
                <p className="text-xs font-bold text-app-muted">{subtitle}</p>
            </div>
        </div>
        {children}
    </article>
);

const EmptyChart: React.FC = () => (
    <div className="grid h-44 place-items-center rounded-lg bg-app-surface text-sm font-bold text-app-muted dark:bg-white/5">
        Sin datos todavia
    </div>
);

const MiniLineChart: React.FC<{ data: AdminMetricPoint[]; color?: string }> = ({ data, color = 'rgb(124 58 237)' }) => {
    const max = Math.max(...data.map((item) => item.count), 0);
    const total = data.reduce((sum, item) => sum + item.count, 0);

    if (total === 0) return <EmptyChart />;

    const width = 360;
    const height = 150;
    const points = data.map((item, index) => {
        const x = data.length <= 1 ? 0 : (index / (data.length - 1)) * width;
        const y = height - (item.count / max) * (height - 12) - 6;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div>
            <div className="rounded-lg bg-app-surface p-3 dark:bg-white/5">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label="Grafica de linea">
                    <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {data.map((item, index) => {
                        if (item.count === 0) return null;
                        const x = data.length <= 1 ? 0 : (index / (data.length - 1)) * width;
                        const y = height - (item.count / max) * (height - 12) - 6;
                        return <circle key={item.date} cx={x} cy={y} r="5" fill={color} stroke="white" strokeWidth="2" />;
                    })}
                </svg>
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-bold text-app-muted">
                <span>{data[0]?.label}</span>
                <span>Total: {compactNumber(total)}</span>
                <span>{data[data.length - 1]?.label}</span>
            </div>
        </div>
    );
};

const ReportStatusChart: React.FC<{ metrics: AdminMetrics }> = ({ metrics }) => {
    const total = metrics.reportsByStatus.reduce((sum, item) => sum + item.count, 0);
    const max = Math.max(...metrics.reportsByStatus.map((item) => item.count), 0);

    if (total === 0) return <EmptyChart />;

    return (
        <div className="space-y-3">
            {metrics.reportsByStatus.map((item) => (
                <div key={item.status}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs font-black">
                        <span>{REPORT_STATUS_LABELS[item.status] ?? item.status}</span>
                        <span className="text-app-muted">{item.count}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-app-surface dark:bg-white/10">
                        <div className="h-full rounded-full bg-bluvi-purple" style={{ width: `${(item.count / max) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [overview, setOverview] = useState<AdminOverview | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
    const [search, setSearch] = useState('');
    const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('all');
    const [reportStatusFilter, setReportStatusFilter] = useState<ReportStatusFilter>('all');
    const [reportContentFilter, setReportContentFilter] = useState<ReportContentFilter>('all');
    const [reportSearch, setReportSearch] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        description: '',
    });
    const [form, setForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        is_verified: true,
    });

    const stats = useMemo(() => overview?.stats ?? { users: 0, admins: 0, reports: 0, blocks: 0 }, [overview]);
    const reportStatusCounts = useMemo(() => {
        return reports.reduce<Record<ReportStatusFilter, number>>((acc, report) => {
            acc.all += 1;
            if (report.status in acc) {
                acc[report.status as ReportStatusFilter] += 1;
            }
            return acc;
        }, {
            all: 0,
            pending: 0,
            dismissed: 0,
            warned: 0,
            content_removed: 0,
        });
    }, [reports]);
    const reportContentCounts = useMemo(() => {
        return reports.reduce<Record<ReportContentFilter, number>>((acc, report) => {
            acc.all += 1;
            if (report.id_message) {
                acc['with-message'] += 1;
            } else {
                acc['user-only'] += 1;
            }
            if (report.reported_message_deleted_at) {
                acc['deleted-content'] += 1;
            }
            return acc;
        }, {
            all: 0,
            'with-message': 0,
            'user-only': 0,
            'deleted-content': 0,
        });
    }, [reports]);
    const filteredReports = useMemo(() => {
        const normalizedSearch = reportSearch.trim().toLowerCase();

        return reports.filter((report) => {
            if (reportStatusFilter !== 'all' && report.status !== reportStatusFilter) {
                return false;
            }

            if (reportContentFilter === 'with-message' && !report.id_message) {
                return false;
            }

            if (reportContentFilter === 'user-only' && report.id_message) {
                return false;
            }

            if (reportContentFilter === 'deleted-content' && !report.reported_message_deleted_at) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const searchableText = [
                report.reported_name,
                report.reported_last_name,
                report.reported_email,
                report.reporter_email,
                report.reason,
                report.reported_message_content,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [reports, reportStatusFilter, reportContentFilter, reportSearch]);

    const loadDashboard = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [data, allUsers] = await Promise.all([
                adminService.getOverview(),
                adminService.listUsers(search, badgeFilter),
            ]);
            const dashboardMetrics = await adminService.getMetrics();
            setOverview(data);
            setUsers(allUsers);
            setReports(data.reports);
            setMetrics(dashboardMetrics);
        } catch (err) {
            console.error('Error al cargar admin', err);
            const message = 'No se pudo cargar el panel de administracion.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    const refreshMetrics = async () => {
        try {
            setMetrics(await adminService.getMetrics());
        } catch (err) {
            console.error('Error al refrescar metricas', err);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            setUsers(await adminService.listUsers(search, badgeFilter));
        } catch {
            const message = 'No se pudo buscar usuarios.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        }
    };

    const applyBadgeFilter = async (nextFilter: BadgeFilter) => {
        setBadgeFilter(nextFilter);
        setError('');

        try {
            setUsers(await adminService.listUsers(search, nextFilter));
        } catch {
            const message = 'No se pudo filtrar usuarios.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        }
    };

    const patchUser = async (selectedUser: AdminUser, payload: Partial<Pick<AdminUser, 'first_name' | 'last_name' | 'description' | 'role' | 'is_verified' | 'is_face_verified' | 'is_visible'>>) => {
        setError('');
        try {
            const updated = await adminService.updateUser(selectedUser.id_user, payload);
            setUsers((current) => current.map((item) => item.id_user === updated.id_user ? updated : item));
            toastQueue.add({ message: 'Usuario actualizado.', type: 'success' }, { timeout: 3500 });
        } catch {
            const message = 'No se pudo actualizar el usuario.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        }
    };

    const openEditUser = (selectedUser: AdminUser) => {
        setEditingUser(selectedUser);
        setEditForm({
            first_name: selectedUser.first_name ?? '',
            last_name: selectedUser.last_name ?? '',
            description: selectedUser.description ?? '',
        });
    };

    const closeEditUser = () => {
        if (isEditingUser) return;
        setEditingUser(null);
    };

    const submitEditUser = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingUser) return;

        setIsEditingUser(true);
        setError('');

        try {
            const updated = await adminService.updateUser(editingUser.id_user, {
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                description: editForm.description,
            });
            setUsers((current) => current.map((item) => item.id_user === updated.id_user ? updated : item));
            setEditingUser(null);
            toastQueue.add({ message: 'Perfil actualizado.', type: 'success' }, { timeout: 3500 });
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'No se pudo actualizar el perfil.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        } finally {
            setIsEditingUser(false);
        }
    };

    const createUser = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const created = await adminService.createUser(form);
            setUsers((current) => [created, ...current]);
            setForm({ email: '', password: '', first_name: '', last_name: '', is_verified: true });
            setActiveTab('users');
            toastQueue.add({ message: 'Admin creado correctamente.', type: 'success' }, { timeout: 3500 });
            await loadDashboard();
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'No se pudo crear el usuario.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        } finally {
            setIsSaving(false);
        }
    };

    const requestDeleteUser = (selectedUser: AdminUser) => {
        const fullName = `${selectedUser.first_name} ${selectedUser.last_name}`.trim() || selectedUser.email;

        setPendingConfirm({
            type: 'delete-user',
            user: selectedUser,
            title: 'Eliminar usuario',
            description: `Vas a eliminar a ${fullName}. Esta accion no se puede deshacer.`,
            confirmText: 'Eliminar',
        });
    };

    const deleteUser = async (selectedUser: AdminUser) => {
        setError('');
        try {
            await adminService.deleteUser(selectedUser.id_user);
            toastQueue.add({ message: 'Usuario eliminado.', type: 'success' }, { timeout: 3500 });
            await loadDashboard();
            await refreshMetrics();
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'No se pudo eliminar el usuario.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        }
    };

    const resolveReport = async (report: AdminReport, action: ReportAction) => {
        setError('');
        try {
            if (action === 'dismiss') {
                await adminService.dismissReport(report.id_report);
                toastQueue.add({ message: 'Reporte desestimado.', type: 'success' }, { timeout: 3500 });
            } else if (action === 'warn') {
                await adminService.warnReportUser(report.id_report);
                toastQueue.add({ message: 'Advertencia enviada.', type: 'success' }, { timeout: 3500 });
            } else {
                await adminService.removeReportContent(report.id_report);
                toastQueue.add({ message: 'Contenido borrado.', type: 'success' }, { timeout: 3500 });
            }

            const freshReports = await adminService.listReports();
            setReports(freshReports);
            const freshOverview = await adminService.getOverview();
            setOverview(freshOverview);
        } catch (err: any) {
            const message = err?.response?.data?.message ?? 'No se pudo aplicar la accion.';
            setError(message);
            toastQueue.add({ message, type: 'error' }, { timeout: 5000 });
        }
    };

    const requestReportAction = (report: AdminReport, action: Exclude<ReportAction, 'dismiss'>) => {
        const config = action === 'warn'
            ? {
                title: 'Enviar advertencia',
                description: 'Se enviara un correo al usuario reportado y el reporte quedara marcado como advertido.',
                confirmText: 'Enviar',
            }
            : {
                title: 'Borrar contenido',
                description: 'El contenido reportado se eliminara del chat y el reporte quedara resuelto.',
                confirmText: 'Borrar',
            };

        setPendingConfirm({
            type: 'report-action',
            report,
            action,
            ...config,
        });
    };

    const handleConfirmAction = () => {
        const currentConfirm = pendingConfirm;
        setPendingConfirm(null);

        if (!currentConfirm) return;

        if (currentConfirm.type === 'delete-user') {
            void deleteUser(currentConfirm.user);
            return;
        }

        void resolveReport(currentConfirm.report, currentConfirm.action);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <main className="min-h-screen bg-app-gradient px-4 py-6 text-app-primary sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <header className="flex flex-col gap-4 rounded-lg border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.07] md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-bluvi-purple dark:text-[#D8D1FF]">Bluvi Admin</p>
                        <h1 className="mt-1 text-2xl font-black text-app-primary sm:text-3xl">Panel de administracion</h1>
                        <p className="mt-1 text-sm font-medium text-app-muted">Sesion iniciada como {user?.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-app-primary shadow-sm transition hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15"
                        >
                            <RefreshCw size={18} />
                            Actualizar
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#231F54] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#302A73]"
                        >
                            <LogOut size={18} />
                            Salir
                        </button>
                    </div>
                </header>

                {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700" role="alert">{error}</p>}

                <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen de administracion">
                    <StatTile label="Usuarios" value={stats.users} icon={<Users size={20} />} />
                    <StatTile label="Admins" value={stats.admins} icon={<Crown size={20} />} />
                    <StatTile label="Reportes" value={stats.reports} icon={<Flag size={20} />} />
                </section>

                <nav className="flex flex-wrap gap-2" aria-label="Secciones admin">
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}><Users size={18} /> Usuarios</TabButton>
                    <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}><Flag size={18} /> Reportes</TabButton>
                    <TabButton active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')}><BarChart3 size={18} /> Métricas</TabButton>
                    <TabButton active={activeTab === 'create-admin'} onClick={() => setActiveTab('create-admin')}><UserPlus size={18} /> Crear admin</TabButton>
                </nav>

                <section className="rounded-lg border border-white/60 bg-white/82 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.07] sm:p-5">
                    {isLoading ? (
                        <div className="grid min-h-64 place-items-center">
                            <Loader2 className="animate-spin text-bluvi-purple" size={34} />
                        </div>
                    ) : activeTab === 'users' ? (
                        <div className="space-y-4">
                            <form onSubmit={handleSearch} className="flex flex-col gap-2 lg:flex-row">
                                <label className="relative flex-1">
                                    <span className="sr-only">Buscar usuario</span>
                                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        className="h-11 w-full rounded-lg border border-app-border bg-white px-10 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10"
                                        placeholder="Buscar por email, nombre o apellido"
                                    />
                                </label>
                                <div className="grid grid-cols-3 rounded-lg border border-app-border bg-white p-1 dark:border-white/15 dark:bg-white/10" role="radiogroup" aria-label="Filtrar por insignia">
                                    {([
                                        ['all', 'Todas'],
                                        ['verified', 'Con insignia'],
                                        ['unverified', 'Sin insignia'],
                                    ] as const).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={badgeFilter === value}
                                            onClick={() => applyBadgeFilter(value)}
                                            className={`h-9 rounded-md px-3 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/40 ${
                                                badgeFilter === value
                                                    ? 'bg-bluvi-purple text-white shadow-sm'
                                                    : 'text-app-muted hover:bg-app-surface dark:hover:bg-white/10'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <button type="submit" className="rounded-lg bg-bluvi-purple px-5 py-2.5 text-sm font-bold text-white">Buscar</button>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="text-xs uppercase text-app-muted">
                                        <tr>
                                            <th className="py-3 pr-4">Usuario</th>
                                            <th className="py-3 pr-4">Rol</th>
                                            <th className="py-3 pr-4">Estado</th>
                                            <th className="py-3 pr-4">Registro</th>
                                            <th className="py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-app-border/70 dark:divide-white/10">
                                        {users.map((item) => (
                                            <tr key={item.id_user}>
                                                <td className="py-3 pr-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditUser(item)}
                                                        className="text-left font-black underline-offset-2 transition hover:text-bluvi-purple hover:underline focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-bluvi-purple/40"
                                                        title="Editar perfil"
                                                    >
                                                        {item.first_name} {item.last_name}
                                                    </button>
                                                    <p className="text-xs font-semibold text-app-muted">{item.email}</p>
                                                </td>
                                                <td className="py-3 pr-4 font-bold">{item.role}</td>
                                                <td className="py-3 pr-4">
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-app-surface px-2.5 py-1 text-xs font-bold">
                                                        {item.is_face_verified ? <CheckCircle2 size={14} /> : <EyeOff size={14} />}
                                                        {item.is_face_verified ? 'Insignia activa' : 'Sin insignia'}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-xs font-semibold text-app-muted">{formatDate(item.created_at)}</td>
                                                <td className="py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button type="button" onClick={() => patchUser(item, { role: item.role === 'admin' ? 'user' : 'admin' })} className="rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-sm dark:bg-white/10">
                                                            {item.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                                                        </button>
                                                        <button type="button" onClick={() => patchUser(item, { is_face_verified: !item.is_face_verified })} className="rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-sm dark:bg-white/10">
                                                            {item.is_face_verified ? 'Quitar insignia' : 'Dar insignia'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => requestDeleteUser(item)}
                                                            disabled={item.id_user === user?.id}
                                                            className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-700 shadow-sm transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/20"
                                                            aria-label="Eliminar usuario"
                                                            title={item.id_user === user?.id ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'reports' ? (
                        <div className="space-y-3">
                            <div className="space-y-3 rounded-lg border border-app-border bg-white p-3 dark:border-white/10 dark:bg-white/10">
                                <label className="relative block">
                                    <span className="sr-only">Buscar reportes</span>
                                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                                    <input
                                        value={reportSearch}
                                        onChange={(event) => setReportSearch(event.target.value)}
                                        className="h-11 w-full rounded-lg border border-app-border bg-app-surface px-10 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10"
                                        placeholder="Buscar por reportado, reportante, email o motivo"
                                    />
                                </label>

                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar reportes por estado">
                                    {REPORT_FILTER_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="radio"
                                            aria-checked={reportStatusFilter === option.value}
                                            onClick={() => setReportStatusFilter(option.value)}
                                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/40 ${
                                                reportStatusFilter === option.value
                                                    ? 'bg-bluvi-purple text-white shadow-sm'
                                                    : 'bg-app-surface text-app-muted hover:bg-app-surface-soft dark:bg-white/10 dark:hover:bg-white/15'
                                            }`}
                                        >
                                            {option.label}
                                            <span className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                                                reportStatusFilter === option.value
                                                    ? 'bg-white/18 text-white'
                                                    : 'bg-white text-app-muted dark:bg-white/10'
                                            }`}>
                                                {reportStatusCounts[option.value]}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar reportes por contenido">
                                    {REPORT_CONTENT_FILTER_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="radio"
                                            aria-checked={reportContentFilter === option.value}
                                            onClick={() => setReportContentFilter(option.value)}
                                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/40 ${
                                                reportContentFilter === option.value
                                                    ? 'bg-[#231F54] text-white shadow-sm'
                                                    : 'bg-app-surface text-app-muted hover:bg-app-surface-soft dark:bg-white/10 dark:hover:bg-white/15'
                                            }`}
                                        >
                                            {option.label}
                                            <span className={`rounded-md px-1.5 py-0.5 text-[11px] ${
                                                reportContentFilter === option.value
                                                    ? 'bg-white/18 text-white'
                                                    : 'bg-white text-app-muted dark:bg-white/10'
                                            }`}>
                                                {reportContentCounts[option.value]}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-xs font-bold text-app-muted">
                                    Mostrando {filteredReports.length} de {reports.length} reportes.
                                </p>
                            </div>

                            {filteredReports.map((report) => (
                                <article key={report.id_report} className="rounded-lg border border-app-border bg-white p-4 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-black">
                                                    {`${report.reported_name || ''} ${report.reported_last_name || ''}`.trim() || report.reported_email}
                                                </p>
                                                <span className="rounded-md bg-app-surface px-2 py-1 text-xs font-black text-app-muted">
                                                    {REPORT_STATUS_LABELS[report.status] ?? report.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-app-primary/80">{report.reported_email}</p>
                                            <p className="text-sm font-semibold text-app-muted">Reportado por {report.reporter_email}</p>
                                        </div>
                                        <span className="text-xs font-bold text-app-muted">{formatDate(report.date)}</span>
                                    </div>
                                    <p className="mt-3 text-sm font-medium">{report.reason}</p>
                                    {report.id_message && (
                                        <div className="mt-3 rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5">
                                            <p className="text-xs font-black uppercase text-app-muted">Contenido reportado</p>
                                            <p className="mt-1 font-semibold text-app-primary">
                                                {report.reported_message_deleted_at
                                                    ? 'Este contenido ya fue eliminado'
                                                    : report.reported_message_type === 'image'
                                                        ? 'Imagen enviada en el chat'
                                                        : report.reported_message_type === 'audio'
                                                            ? 'Nota de audio enviada en el chat'
                                                            : report.reported_message_content || 'Mensaje sin contenido'}
                                            </p>
                                        </div>
                                    )}
                                    {report.action_taken_at && (
                                        <p className="mt-2 text-xs font-bold text-app-muted">Resuelto el {formatDate(report.action_taken_at)}</p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => resolveReport(report, 'dismiss')}
                                            disabled={report.status !== 'pending'}
                                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-app-primary shadow-sm transition hover:bg-app-surface disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white/10 dark:hover:bg-white/15"
                                        >
                                            <Ban size={15} />
                                            Desestimar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => requestReportAction(report, 'warn')}
                                            disabled={report.status !== 'pending'}
                                            className="inline-flex items-center gap-2 rounded-lg bg-[#fff7ed] px-3 py-2 text-xs font-black text-[#9a3412] shadow-sm transition hover:bg-[#ffedd5] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-orange-500/15 dark:text-orange-100 dark:hover:bg-orange-500/20"
                                        >
                                            <Megaphone size={15} />
                                            Advertir
                                        </button>
                                        <TooltipTrigger delay={300}>
                                            <AriaButton
                                                onPress={() => {
                                                    if (report.status !== 'pending' || !report.id_message) return;
                                                    requestReportAction(report, 'remove-content');
                                                }}
                                                aria-label="Borrar contenido reportado"
                                                aria-disabled={report.status !== 'pending' || !report.id_message}
                                                className={`inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700 shadow-sm transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:bg-red-500/15 dark:text-red-100 dark:hover:bg-red-500/20 ${
                                                    report.status !== 'pending' || !report.id_message ? 'cursor-not-allowed opacity-45' : ''
                                                }`}
                                            >
                                                <Trash2 size={15} />
                                                Borrar contenido
                                            </AriaButton>
                                            <Tooltip>
                                                {!report.id_message
                                                    ? 'Este reporte no tiene contenido concreto asociado'
                                                    : report.status !== 'pending'
                                                        ? 'Este reporte ya esta resuelto'
                                                        : 'Borrar contenido reportado'}
                                            </Tooltip>
                                        </TooltipTrigger>
                                    </div>
                                </article>
                            ))}
                            {reports.length === 0 && <p className="py-10 text-center text-sm font-bold text-app-muted">No hay reportes.</p>}
                            {reports.length > 0 && filteredReports.length === 0 && (
                                <p className="py-10 text-center text-sm font-bold text-app-muted">No hay reportes en este estado.</p>
                            )}
                        </div>
                    ) : activeTab === 'metrics' ? (
                        metrics ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                                <ChartCard title="Registros" subtitle="Nuevas cuentas en los ultimos 30 dias">
                                    <MiniLineChart data={metrics.registrationsByDay} />
                                </ChartCard>
                                <ChartCard title="Reportes" subtitle="Reportes creados en los ultimos 30 dias">
                                    <MiniLineChart data={metrics.reportsByDay} color="rgb(124 58 237)" />
                                </ChartCard>
                                <ChartCard title="Estados de reportes" subtitle="Distribucion actual de moderacion">
                                    <ReportStatusChart metrics={metrics} />
                                </ChartCard>
                                <ChartCard title="Cuentas borradas" subtitle="Eliminaciones registradas en los ultimos 30 dias">
                                    <MiniLineChart data={metrics.deletedAccountsByDay} color="rgb(239 68 68)" />
                                </ChartCard>
                            </div>
                        ) : (
                            <p className="py-10 text-center text-sm font-bold text-app-muted">No se pudieron cargar las metricas.</p>
                        )
                    ) : (
                        <form onSubmit={createUser} className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1.5">
                                <span className="text-sm font-bold">Nombre</span>
                                <input required value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} className="h-11 w-full rounded-lg border border-app-border bg-white px-3 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10" />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-sm font-bold">Apellido</span>
                                <input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} className="h-11 w-full rounded-lg border border-app-border bg-white px-3 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10" />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-sm font-bold">Email</span>
                                <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 w-full rounded-lg border border-app-border bg-white px-3 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10" />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-sm font-bold">Contrasena</span>
                                <input required type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="h-11 w-full rounded-lg border border-app-border bg-white px-3 text-sm font-semibold outline-none focus:border-bluvi-purple dark:border-white/15 dark:bg-white/10" />
                            </label>
                            <label className="flex items-center gap-3 pt-7 text-sm font-bold">
                                <input type="checkbox" checked={form.is_verified} onChange={(event) => setForm({ ...form, is_verified: event.target.checked })} className="h-5 w-5 accent-bluvi-purple" />
                                Crear como verificado
                            </label>
                            <div className="md:col-span-2">
                                <button disabled={isSaving} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-bluvi-purple px-5 py-3 text-sm font-bold text-white shadow-md shadow-bluvi-purple/20 disabled:opacity-60">
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                                    Crear admin
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </div>
            {editingUser && (
                <ModalOverlay
                    isOpen={Boolean(editingUser)}
                    onOpenChange={(open) => !open && closeEditUser()}
                    isDismissable={!isEditingUser}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md animate-fade-in dark:bg-black/55"
                >
                    <Modal className="w-full max-w-lg outline-none">
                        <Dialog
                            className="w-full overflow-hidden rounded-[2rem] border border-app-soft bg-app-surface-strong text-app-primary shadow-2xl outline-none animate-scale-in"
                            aria-labelledby="edit-user-title"
                        >
                            <form onSubmit={submitEditUser}>
                                <div className="flex items-center justify-between gap-4 bg-app-surface-strong px-6 pb-4 pt-6">
                                    <div>
                                        <Heading id="edit-user-title" slot="title" className="font-heading text-xl font-bold text-app-primary">
                                            Editar perfil
                                        </Heading>
                                        <p className="mt-1 text-sm font-semibold text-app-muted">{editingUser.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeEditUser}
                                        disabled={isEditingUser}
                                        className="grid h-9 w-9 place-items-center rounded-full text-app-muted transition-colors hover:bg-app-surface-soft disabled:opacity-60"
                                        aria-label="Cerrar"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="grid max-h-[65vh] gap-5 overflow-y-auto bg-app-surface-strong px-6 py-5 sm:grid-cols-2">
                                    <label className="space-y-1.5">
                                        <span className="ml-1 text-[10px] font-bold uppercase text-app-secondary">Nombre</span>
                                        <input
                                            required
                                            maxLength={80}
                                            value={editForm.first_name}
                                            onChange={(event) => setEditForm({ ...editForm, first_name: event.target.value })}
                                            className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20"
                                        />
                                    </label>
                                    <label className="space-y-1.5">
                                        <span className="ml-1 text-[10px] font-bold uppercase text-app-secondary">Apellido</span>
                                        <input
                                            maxLength={80}
                                            value={editForm.last_name}
                                            onChange={(event) => setEditForm({ ...editForm, last_name: event.target.value })}
                                            className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20"
                                        />
                                    </label>
                                    <label className="space-y-1.5 sm:col-span-2">
                                        <span className="ml-1 text-[10px] font-bold uppercase text-app-secondary">Descripcion</span>
                                        <textarea
                                            maxLength={1200}
                                            rows={5}
                                            value={editForm.description}
                                            onChange={(event) => setEditForm({ ...editForm, description: event.target.value })}
                                            className="w-full resize-none rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium leading-relaxed text-app-primary outline-none transition-all placeholder:text-app-muted focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20"
                                        />
                                        <span className="block text-right text-xs font-bold text-app-muted">{editForm.description.length}/1200</span>
                                    </label>
                                </div>

                                <div className="flex flex-col-reverse gap-3 bg-app-surface-soft p-6 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={closeEditUser}
                                        disabled={isEditingUser}
                                        className="flex-1 rounded-full border border-app-soft border-b-2 border-black/10 bg-app-surface px-6 py-2.5 font-semibold text-app-secondary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-app-surface-strong hover:text-app-primary active:translate-y-0 disabled:opacity-60"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditingUser}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-b-2 border-black/10 bg-bluvi-purple px-6 py-2.5 font-semibold text-white shadow-md shadow-bluvi-purple/20 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:opacity-60"
                                    >
                                        {isEditingUser && <Loader2 className="animate-spin" size={16} />}
                                        {isEditingUser ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            )}
            <ConfirmModal
                isOpen={Boolean(pendingConfirm)}
                title={pendingConfirm?.title ?? ''}
                description={pendingConfirm?.description ?? ''}
                confirmText={pendingConfirm?.confirmText ?? 'Confirmar'}
                cancelText="Cancelar"
                onConfirm={handleConfirmAction}
                onCancel={() => setPendingConfirm(null)}
            />
        </main>
    );
};
