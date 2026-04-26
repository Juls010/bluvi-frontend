import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

interface LegalLayoutProps {
    children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    return (
        <main className="min-h-screen w-full bg-app-gradient text-bluvi-purple flex flex-col font-sans relative overflow-x-hidden" aria-label="Contenido principal">
            <nav className="w-full flex items-center justify-between px-0 sm:px-6 pt-6 pb-2" aria-label="Navegación legal">
                <button
                    type="button"
                    onClick={() => navigate(isAuthenticated ? '/app/home' : '/')}
                    className="ml-2 sm:ml-0 flex items-center gap-2 text-bluvi-purple/80 hover:text-app-accent font-semibold text-sm px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white/80 shadow-sm backdrop-blur-md transition-colors focus:outline-none"
                    tabIndex={0}
                    aria-label="Volver"
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    <span className="sr-only">Volver</span>
                    <span aria-hidden="true" className="not-sr-only">Volver</span>
                </button>
                <div className="flex-1 flex justify-center">
                    <img
                        src={logo}
                        alt="Bluvi"
                        className="w-55 max-w-xs h-auto mb-0 drop-shadow-lg select-none"
                        draggable={false}
                        aria-label="Logo Bluvi"
                    />
                </div>
                <div className="w-[80px]" aria-hidden="true" /> 
            </nav>
            <div className="flex flex-col items-center w-full flex-1 pt-6 pb-20 px-2" role="region" aria-label="Contenido legal">
                <div className="w-full max-w-3xl bg-app-surface-card-strong/90  rounded-2xl " tabIndex={0} aria-label="Documento legal">
                    {children}
                </div>
            </div>
            <footer className="w-full text-xs text-bluvi-purple/60 mt-auto mb-8 text-center font-medium tracking-wide" role="contentinfo">
                &copy; {new Date().getFullYear()} Bluvi. Proyecto académico sin ánimo de lucro.
            </footer>
        </main>
    );
};

export default LegalLayout;
