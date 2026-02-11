import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/icon.svg';

export const Navbar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.includes(path);
    
    // Función para manejar las clases dinámicas de los iconos
    const iconClass = (path: string) => `w-6 h-6 transition-all duration-200 ${
        isActive(path) 
        ? 'text-bluvi-purple scale-110 stroke-[2.5px]' 
        : 'text-bluvi-purple/70 hover:text-bluvi-purple stroke-[1.5px]'
    }`;

    return (
        <nav className="w-full max-w-5xl mx-auto px-8 py-3 bg-white/20 backdrop-blur-xl rounded-full flex justify-between items-center shadow-lg border border-white/30">
            
            <Link to="/app/home" className="hover:opacity-80 flex-shrink-0">
                <img src={logo} alt="b." className="w-8 h-8 object-contain" />
            </Link>

            <div className="flex items-center gap-8 text-bluvi-purple">
                <Link to="/app/discovery" aria-label="Buscar">
                    <svg className={iconClass('discovery')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </Link>

                <Link to="/app/messages" aria-label="Messages">
                    <svg className={iconClass('messages')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </Link>
                
                <Link to="/app/home" aria-label="Home">
                    <svg className={iconClass('home')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </Link>
            </div>
        </nav>
    );
};