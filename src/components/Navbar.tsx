import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/icon.svg';
import { getConversations } from '../services/chat.service';
import { connectRealtime } from '../services/realtime.service';

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
        flex flex-col items-center transition-all duration-200
        ${mobile
            ? 'flex-1 gap-1.5 py-2.5'
            : `gap-1 px-4 py-2 rounded-2xl ${active ? 'bg-bluvi-purple/12 ring-1 ring-bluvi-purple/20' : 'hover:bg-bluvi-purple/5'}`
        }
        `}
    >
        <span
        className={`
            relative
            transition-all duration-200
            ${mobile ? 'w-6 h-6' : 'w-5 h-5'}
            ${active
            ? 'text-bluvi-purple scale-110 [&>svg]:stroke-[2.3px]'
            : 'text-bluvi-purple/60 [&>svg]:stroke-[1.9px]'
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
            ? `text-[10px] max-h-4 opacity-100 ${active ? 'text-bluvi-purple' : 'text-bluvi-purple/40'}`
            : `text-[11px] max-h-4 opacity-100 ${active ? 'text-bluvi-purple' : 'text-bluvi-purple/70'}`
            }
        `}
        >
        {label}
        </span>
        {unreadCount > 0 && <span className="sr-only">Tienes {unreadCount} mensajes sin leer</span>}
    </Link>
);



export const Navbar: React.FC = () => {
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const loadUnreadCount = async () => {
        try {
            const conversations = await getConversations();
            const totalUnread = conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
            setUnreadCount(totalUnread);
        } catch (error) {
            console.error('Error cargando contador de mensajes:', error);
        }
    };

    useEffect(() => {
        loadUnreadCount();

        const intervalId = window.setInterval(() => {
            loadUnreadCount();
        }, 15000);

        const socket = connectRealtime();
        const refreshUnread = () => {
            loadUnreadCount();
        };

        socket?.on('chat:message:new', refreshUnread);
        socket?.on('chat:messages:read', refreshUnread);

        return () => {
            window.clearInterval(intervalId);
            socket?.off('chat:message:new', refreshUnread);
            socket?.off('chat:messages:read', refreshUnread);
        };
    }, []);

    const desktopNavItems = useMemo(() => NAV_ITEMS, []);

    return (
        <>
        <nav className="hidden md:grid w-full max-w-5xl mx-auto px-6 py-2 bg-white/25 backdrop-blur-xl rounded-3xl items-center shadow-lg border border-white/35 grid-cols-[2.5rem_1fr_2.5rem]">
            <Link to="/app/home" className="hover:opacity-80 flex-shrink-0 justify-self-start" aria-label="Ir a inicio">
            <img src={logo} alt="bluvi" className="w-8 h-8 object-contain" />
            </Link>
            <div className="flex items-center justify-center gap-2">
            {desktopNavItems.map(({ path, key, label, icon, isActive }) => (
                <NavItem
                    key={key}
                    path={path}
                    label={label}
                    icon={icon}
                    active={isActive(location.pathname)}
                    unreadCount={key === 'messages' ? unreadCount : 0}
                />
            ))}
            </div>
            <div className="w-8 h-8 justify-self-end" aria-hidden="true" />
        </nav>

        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch gap-1 px-1.5 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {NAV_ITEMS.map(({ path, key, label, icon, isActive }) => (
            <NavItem
                key={key}
                path={path}
                label={label}
                icon={icon}
                active={isActive(location.pathname)}
                unreadCount={key === 'messages' ? unreadCount : 0}
                mobile
            />
            ))}
        </nav>

        <div className="md:hidden h-16" />
        </>
    );
};