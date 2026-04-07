import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/icon.svg';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/user.service';

const NAV_ITEMS = [
    {
        path: '/app/home',
        key: 'home',
        label: 'Inicio',
        isActive: (pathname: string) => pathname.startsWith('/app/home'),
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        ),
    },
    {
        path: '/app/discovery',
        key: 'discovery',
        label: 'Buscar',
        isActive: (pathname: string) => pathname.startsWith('/app/discovery'),
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        ),
    },
    {
        path: '/app/messages',
        key: 'messages',
        label: 'Mensajes',
        isActive: (pathname: string) => pathname.startsWith('/app/messages') || pathname.startsWith('/app/chat/'),
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        ),
    },
    {
        path: '/app/profile',
        key: 'profile',
        label: 'Perfil',
        isActive: (pathname: string) => pathname.startsWith('/app/profile') || pathname.startsWith('/app/user/'),
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
        ),
    },
    {
        path: '/app/settings',
        key: 'settings',
        label: 'Ajustes',
        isActive: (pathname: string) => pathname.startsWith('/app/settings'),
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.92 4.6h.08A1.65 1.65 0 0 0 10.51 3.1V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.31.48.84.8 1.41.84H21a2 2 0 1 1 0 4h-.09c-.57.04-1.1.36-1.41.84z" />
        </svg>
        ),
    },
];

const DESKTOP_NAV_KEYS = new Set(['home', 'discovery', 'messages']);

const NavItem: React.FC<{
    path: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    unreadCount?: number;
    mobile?: boolean;
    }> = ({ path, label, icon, active, unreadCount = 0, mobile = false }) => (
    <Link
        to={path}
        aria-label={label}
        className={`
        flex items-center transition-all duration-200
        ${mobile
            ? 'flex-1 gap-1.5 py-2.5'
            : `gap-2 px-3.5 py-2 rounded-xl ${active ? 'bg-bluvi-purple/12 ring-1 ring-bluvi-purple/20' : 'hover:bg-app-surface-soft'}`
        }
        `}
    >
        <span
        className={`
            relative
            transition-all duration-200
            ${mobile ? 'w-6 h-6' : 'w-4.5 h-4.5'}
            ${active
            ? 'text-bluvi-purple scale-110 [&>svg]:stroke-[2.3px]'
            : 'text-app-secondary [&>svg]:stroke-[1.9px]'
            }
        `}
        >
        {icon}
        {unreadCount > 0 && (
            <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white"
            />
        )}
        </span>

        <span
        className={`
            font-semibold leading-none tracking-wide transition-all duration-200 overflow-hidden
            ${mobile
            ? `text-[10px] max-h-4 opacity-100 ${active ? 'text-bluvi-purple' : 'text-app-muted'}`
            : `text-[13px] max-h-4 opacity-100 ${active ? 'text-bluvi-purple' : 'text-app-secondary'}`
            }
        `}
        >
        {label}
        </span>
        {mobile && unreadCount > 0 && (
            <span className="mt-1 inline-flex items-center justify-center rounded-full bg-green-500 px-2 py-0.5 text-[9px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
        )}
        {unreadCount > 0 && <span className="sr-only">Tienes {unreadCount} mensajes sin leer</span>}
    </Link>
);



export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const { unreadMessages, pendingMatchRequests } = useNotifications();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [profileSnapshot, setProfileSnapshot] = useState<Record<string, unknown> | null>(null);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);

    const desktopNavItems = useMemo(() => NAV_ITEMS.filter((item) => DESKTOP_NAV_KEYS.has(item.key)), []);

    const identitySource = useMemo(() => {
        return {
            ...(user as Record<string, unknown> | null),
            ...(profileSnapshot ?? {}),
        };
    }, [user, profileSnapshot]);

    const displayName = useMemo(() => {
        const nameCandidates = [
            identitySource.first_name,
            identitySource.firstName,
            identitySource.name,
        ];

        const match = nameCandidates.find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0);
        return typeof match === 'string' ? match.trim() : 'Usuaria';
    }, [identitySource]);

    const avatarSrc = useMemo(() => {
        const data = identitySource;
        const resolveFromEntry = (entry: unknown): string | undefined => {
            if (typeof entry === 'string' && entry.trim().length > 0) {
                return entry;
            }

            if (entry && typeof entry === 'object') {
                const imageObj = entry as Record<string, unknown>;
                const objectCandidates = [
                    imageObj.url,
                    imageObj.photo,
                    imageObj.path,
                    imageObj.image,
                    imageObj.src,
                ];
                const objectMatch = objectCandidates.find((item) => typeof item === 'string' && item.trim().length > 0);
                if (typeof objectMatch === 'string') {
                    return objectMatch;
                }
            }

            return undefined;
        };

        const candidates = [
            data.main_photo,
            data.photo,
            data.avatar,
            data.image,
            data.profile_image,
            data.profile_photo,
            Array.isArray(data.photos)
                ? data.photos.map((entry) => resolveFromEntry(entry)).find((entry) => typeof entry === 'string' && entry.trim().length > 0)
                : undefined,
        ];

        const photo = candidates.find((entry) => typeof entry === 'string' && entry.trim().length > 0);
        return typeof photo === 'string' ? photo : '';
    }, [identitySource]);

    const avatarInitial = useMemo(() => {
        if (!displayName) return 'U';
        return displayName.charAt(0).toUpperCase();
    }, [displayName]);

    const isUserSectionActive = location.pathname.startsWith('/app/profile') || location.pathname.startsWith('/app/settings') || location.pathname.startsWith('/app/user/');

    useEffect(() => {
        if (!isUserMenuOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!userMenuRef.current?.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isUserMenuOpen]);

    useEffect(() => {
        if (isUserMenuOpen) {
            firstMenuItemRef.current?.focus();
        }
    }, [isUserMenuOpen]);

    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        let cancelled = false;

        const loadProfileSnapshot = async () => {
            if (!isAuthenticated) return;

            try {
                const profile = await getMyProfile();
                if (!cancelled) {
                    setProfileSnapshot(profile as unknown as Record<string, unknown>);
                }
            } catch {
                if (!cancelled) {
                    setProfileSnapshot(null);
                }
            }
        };

        loadProfileSnapshot();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <>
        <nav className="hidden md:grid w-full max-w-5xl mx-auto px-4 py-2.5 bg-app-surface-nav backdrop-blur-xl rounded-3xl items-center shadow-lg border border-app-soft grid-cols-[minmax(7rem,1fr)_auto_minmax(7rem,1fr)] gap-3">
            <div className="justify-self-start">
                <Link to="/app/home" className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity" aria-label="Ir a inicio">
                    <img src={logo} alt="bluvi" className="w-8 h-8 object-contain" />
                    <span className="text-sm font-semibold tracking-wide text-app-secondary">bluvi</span>
                </Link>
            </div>

            <div className="justify-self-center">
                <div className="flex items-center gap-1.5">
                    {desktopNavItems.map(({ path, key, label, icon, isActive }) => (
                        <NavItem
                            key={key}
                            path={path}
                            label={label}
                            icon={icon}
                            active={isActive(location.pathname)}
                            unreadCount={key === 'messages' ? unreadMessages + pendingMatchRequests : 0}
                        />
                    ))}
                </div>
            </div>

            <div ref={userMenuRef} className="relative justify-self-end">
                <button
                    ref={menuButtonRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                    aria-controls="user-navbar-menu"
                    aria-label={`Cuenta de ${displayName}`}
                    onClick={toggleUserMenu}
                    className={`
                        relative w-10 h-10 rounded-xl overflow-visible border shadow-sm
                        bg-app-surface transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-light-purple/50
                        ${isUserSectionActive ? 'border-bluvi-purple/60 ring-2 ring-bluvi-purple/20' : 'border-app-soft hover:border-bluvi-purple/35'}
                    `}
                >
                    <span className="block w-full h-full rounded-xl overflow-hidden">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="w-full h-full flex items-center justify-center text-sm font-bold text-bluvi-purple bg-bluvi-light-purple/50">
                                {avatarInitial}
                            </span>
                        )}
                    </span>
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white"
                    />
                </button>

                {isUserMenuOpen && (
                    <div
                        id="user-navbar-menu"
                        role="menu"
                        aria-label="Menú de cuenta"
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-app-soft bg-app-surface-strong backdrop-blur-md shadow-xl p-1.5"
                    >
                        <p className="px-3 py-2 text-xs font-semibold text-app-secondary" aria-live="polite">
                            Sesión iniciada como {displayName}
                        </p>
                        <Link
                            ref={firstMenuItemRef}
                            to="/app/profile"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-app-primary hover:bg-app-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-light-purple"
                        >
                            Ver mi perfil
                        </Link>
                        <Link
                            to="/app/settings"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium text-app-primary hover:bg-app-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-light-purple"
                        >
                            Ajustes de cuenta
                        </Link>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="w-full text-left rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>

        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch gap-1 px-1.5 bg-app-surface-nav backdrop-blur-xl border-t border-app-soft shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {NAV_ITEMS.map(({ path, key, label, icon, isActive }) => (
            <NavItem
                key={key}
                path={path}
                label={label}
                icon={icon}
                active={isActive(location.pathname)}
                unreadCount={key === 'messages' ? unreadMessages + pendingMatchRequests : 0}
                mobile
            />
            ))}
        </nav>

        <div className="md:hidden h-16" />
        </>
    );
};