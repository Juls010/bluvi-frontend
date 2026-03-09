import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/icon.svg';

const NAV_ITEMS = [
    {
        path: '/app/home',
        key: 'home',
        label: 'Inicio',
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
        icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
        ),
    },
];

const NavItem: React.FC<{
    path: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    mobile?: boolean;
    }> = ({ path, label, icon, active, mobile = false }) => (
    <Link
        to={path}
        aria-label={label}
        className={`
        flex flex-col items-center transition-all duration-200
        ${mobile
            ? 'flex-1 gap-1 py-2'
            : `gap-0.5 px-4 py-1.5 rounded-full ${active ? 'bg-bluvi-purple/10' : 'hover:bg-bluvi-purple/5'}`
        }
        `}
    >
        <span
        className={`
            transition-all duration-200
            ${mobile ? 'w-6 h-6' : 'w-5 h-5'}
            ${active
            ? 'text-bluvi-purple scale-110 [&>svg]:stroke-[2.5px]'
            : 'text-bluvi-purple/50 [&>svg]:stroke-[1.5px]'
            }
        `}
        >
        {icon}
        </span>

        <span
        className={`
            font-semibold leading-none tracking-wide transition-all duration-200 overflow-hidden
            ${mobile
            ? `text-[10px] max-h-4 opacity-100 ${active ? 'text-bluvi-purple' : 'text-bluvi-purple/40'}`
            : `text-[10px] ${active ? 'max-h-4 opacity-100 text-bluvi-purple' : 'max-h-0 opacity-0'}`
            }
        `}
        >
        {label}
        </span>
    </Link>
);



export const Navbar: React.FC = () => {
    const location = useLocation();
    const isActive = (key: string) => location.pathname.includes(key);

    return (
        <>
        <nav className="hidden md:flex w-full max-w-5xl mx-auto px-8 py-2 bg-white/20 backdrop-blur-xl rounded-full justify-between items-center shadow-lg border border-white/30">
            <Link to="/app/home" className="hover:opacity-80 flex-shrink-0">
            <img src={logo} alt="bluvi" className="w-8 h-8 object-contain" />
            </Link>
            <div className="flex items-center gap-2">
            {NAV_ITEMS.map(({ path, key, label, icon }) => (
                <NavItem key={key} path={path} label={label} icon={icon} active={isActive(key)} />
            ))}
            </div>
        </nav>

        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {NAV_ITEMS.map(({ path, key, label, icon }) => (
            <NavItem key={key} path={path} label={label} icon={icon} active={isActive(key)} mobile />
            ))}
        </nav>

        <div className="md:hidden h-16" />
        </>
    );
};