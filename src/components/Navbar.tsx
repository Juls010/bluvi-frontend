import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Link,
    useLocation,
    useNavigate } from 'react-router-dom';
import { ChatCircleIcon,
    HouseIcon,
    MagnifyingGlassIcon,
    UserIcon
} from '@phosphor-icons/react';
import logo from '../assets/logo.svg';
import { DropdownMenu, DropdownMenuButton, DropdownMenuLink } from './DropdownMenu';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/user.service';

const NAV_ITEMS = [
    {
        path: '/app/home',
        key: 'home',
        label: 'Inicio',
        isActive: (pathname: string) => pathname.startsWith('/app/home'),
        icon: <HouseIcon className="h-full w-full" weight="bold" aria-hidden="true" />,
    },
    {
        path: '/app/discovery',
        key: 'discovery',
        label: 'Buscar',
        isActive: (pathname: string) => pathname.startsWith('/app/discovery'),
        icon: <MagnifyingGlassIcon className="h-full w-full" weight="bold" aria-hidden="true" />,
    },
    {
        path: '/app/messages',
        key: 'messages',
        label: 'Mensajes',
        isActive: (pathname: string) => pathname.startsWith('/app/messages') || pathname.startsWith('/app/chat/'),
        icon: <ChatCircleIcon className="h-full w-full" weight="bold" aria-hidden="true" />,
    },
    {
        path: '/app/profile',
        key: 'profile',
        label: 'Perfil',
        isActive: (pathname: string) => pathname.startsWith('/app/profile') || pathname.startsWith('/app/user/'),
        icon: <UserIcon className="h-full w-full" weight="bold" aria-hidden="true" />,
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
        flex items-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2
        ${mobile
            ? 'flex-1 flex-col justify-center gap-1 py-2.5 text-center'
            : `gap-2 px-3.5 py-2 rounded-xl ${active ? 'bg-app-surface-soft ring-2 ring-[var(--navbar-active-ring)]' : 'hover:bg-app-surface-soft'}`
        }
        `}
    >
        <span
        className={`
            relative
            transition-all duration-300
            ${mobile ? 'w-6 h-6' : 'w-4.5 h-4.5'}
            ${active
            ? 'text-app-accent scale-110 [&>svg]:stroke-[2.5px]'
            : 'text-app-secondary/60 [&>svg]:stroke-[2.05px] hover:text-app-secondary'
            }
        `}
        >
        {icon}
        {unreadCount > 0 && (
            <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-app-surface"
                style={{ backgroundColor: '#22c55e' }}
            />
        )}
        </span>

        <span
        className={`
            font-bold leading-none tracking-wide transition-all duration-300 overflow-visible
            ${mobile
            ? `text-[10px] ${active ? 'text-app-accent opacity-100' : 'text-app-muted opacity-60'}`
            : `text-[13px] ${active ? 'text-app-accent opacity-100' : 'text-app-secondary opacity-70'}`
            }
        `}
        >
        {label}
        </span>
        {unreadCount > 0 && <span className="sr-only">Tienes {unreadCount} mensajes sin leer</span>}
    </Link>
);



export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const { unreadMessages, pendingMatchRequests } = useNotifications();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isUserMenuClosing, setIsUserMenuClosing] = useState(false);
    const [profileSnapshot, setProfileSnapshot] = useState<Record<string, unknown> | null>(null);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
    const closeMenuTimerRef = useRef<number | null>(null);

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
                    imageObj.url_photo,
                    imageObj.photo,
                    imageObj.path,
                    imageObj.image,
                    imageObj.src,
                    imageObj.avatar_url,
                    imageObj.secure_url,
                ];
                const objectMatch = objectCandidates.find((item) => typeof item === 'string' && item.trim().length > 0);
                if (typeof objectMatch === 'string') {
                    return objectMatch;
                }
            }

            return undefined;
        };

        const resolvePhotoCollection = (value: unknown): string | undefined => {
            if (Array.isArray(value)) {
                return value.map((entry) => resolveFromEntry(entry)).find((entry) => typeof entry === 'string' && entry.trim().length > 0);
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) {
                    return undefined;
                }

                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        return parsed.map((entry) => resolveFromEntry(entry)).find((entry) => typeof entry === 'string' && entry.trim().length > 0);
                    }
                } catch {
                    return resolveFromEntry(trimmed);
                }

                return resolveFromEntry(trimmed);
            }

            return undefined;
        };

        const candidates = [
            data.main_photo,
            data.mainPhoto,
            data.photo,
            data.avatar,
            data.image,
            data.profile_image,
            data.profile_photo,
            data.url_photo,
            data.avatar_url,
            resolvePhotoCollection(data.photos),
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

        const requestCloseMenu = () => {
            if (isUserMenuClosing) {
                return;
            }

            setIsUserMenuClosing(true);

            if (closeMenuTimerRef.current) {
                window.clearTimeout(closeMenuTimerRef.current);
            }

            closeMenuTimerRef.current = window.setTimeout(() => {
                setIsUserMenuOpen(false);
                setIsUserMenuClosing(false);
                closeMenuTimerRef.current = null;
            }, 170);
        };

        const handlePointerDown = (event: MouseEvent) => {
            if (!userMenuRef.current?.contains(event.target as Node)) {
                requestCloseMenu();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                requestCloseMenu();
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isUserMenuOpen, isUserMenuClosing]);

    useEffect(() => {
        if (isUserMenuOpen) {
            firstMenuItemRef.current?.focus();
        }
    }, [isUserMenuOpen]);

    useEffect(() => {
        return () => {
            if (closeMenuTimerRef.current) {
                window.clearTimeout(closeMenuTimerRef.current);
            }
        };
    }, []);

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

    const closeUserMenu = () => {
        if (!isUserMenuOpen || isUserMenuClosing) {
            return;
        }

        setIsUserMenuClosing(true);

        if (closeMenuTimerRef.current) {
            window.clearTimeout(closeMenuTimerRef.current);
        }

        closeMenuTimerRef.current = window.setTimeout(() => {
            setIsUserMenuOpen(false);
            setIsUserMenuClosing(false);
            closeMenuTimerRef.current = null;
        }, 170);
    };

    const toggleUserMenu = () => {
        if (isUserMenuOpen) {
            closeUserMenu();
            return;
        }

        if (closeMenuTimerRef.current) {
            window.clearTimeout(closeMenuTimerRef.current);
            closeMenuTimerRef.current = null;
        }

        setIsUserMenuClosing(false);
        setIsUserMenuOpen(true);
    };

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <>
        <nav className="hidden md:grid w-full max-w-5xl mx-auto px-4 py-2.5 bg-app-surface-nav backdrop-blur-xl rounded-3xl items-center shadow-lg border-2 border-app-soft grid-cols-[minmax(7rem,1fr)_auto_minmax(7rem,1fr)] gap-3">
            <div className="justify-self-start">
                <Link to="/app/home" className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2 rounded-xl" aria-label="Ir a inicio">
                    <img src={logo} alt="bluvi" className="w-32 h-8 object-contain" />
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
                    aria-expanded={isUserMenuOpen && !isUserMenuClosing}
                    aria-controls="user-navbar-menu"
                    aria-label={`Cuenta de ${displayName}`}
                    onClick={toggleUserMenu}
                    className={`
                        relative w-10 h-10 rounded-xl overflow-visible border shadow-sm transition-all duration-200
                        bg-app-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2
                        ${isUserSectionActive 
                            ? 'border-white/80 shadow-md ring-1 ring-white/20' 
                            : 'border-white/40 hover:border-white/60'
                        }
                    `}
                >
                    <span className="block w-full h-full rounded-xl overflow-hidden">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="w-full h-full flex items-center justify-center text-sm font-bold text-app-accent bg-app-surface-soft">
                                {avatarInitial}
                            </span>
                        )}
                    </span>
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-1 ring-app-surface dark:ring-black bg-green-300"
                    />
                </button>

                {isUserMenuOpen && (
                    <DropdownMenu
                        id="user-navbar-menu"
                        label="Menú de cuenta"
                        isOpen={isUserMenuOpen}
                        isClosing={isUserMenuClosing}
                    >
                        <p className="px-3 py-2 text-xs font-semibold text-app-secondary" aria-live="polite">
                            Sesión iniciada como {displayName}
                        </p>
                        <DropdownMenuLink
                            ref={firstMenuItemRef}
                            to="/app/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                        >
                            Ver mi perfil
                        </DropdownMenuLink>
                        <DropdownMenuLink
                            to="/app/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                        >
                            Ajustes de cuenta
                        </DropdownMenuLink>
                        <DropdownMenuButton
                            onClick={handleLogout}
                            danger
                        >
                            Cerrar sesión
                        </DropdownMenuButton>
                    </DropdownMenu>
                )}
            </div>
        </nav>

        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center px-4 bg-app-surface-nav backdrop-blur-xl border-t-2 border-app-soft shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pointer-events-auto"
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
