import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

interface LegalLayoutProps {
    children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const navigationState = location.state as { fromFooter?: boolean; returnTo?: string } | null;

    const handleBack = () => {
        if (navigationState?.fromFooter && navigationState.returnTo) {
            navigate(`${navigationState.returnTo}#footer`, { replace: true });
            return;
        }

        navigate(isAuthenticated ? '/app/home' : '/');
    };

    return (
        <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-app-gradient font-sans text-app-primary" aria-label="Contenido principal">
            <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-5 pb-2 sm:px-6" aria-label="Navegacion legal">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-lg border border-app-soft bg-app-surface-soft px-3 py-2 text-sm font-bold text-app-secondary shadow-sm backdrop-blur-md transition-colors hover:bg-app-surface-strong hover:text-app-accent focus:outline-none"
                    aria-label="Volver"
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Volver</span>
                </button>

                <div className="flex flex-1 justify-center">
                    <img
                        src={logo}
                        alt="Bluvi"
                        className="h-auto w-32 select-none drop-shadow-sm sm:w-40"
                        draggable={false}
                    />
                </div>

                <div className="w-[80px]" aria-hidden="true" />
            </nav>

            <div className="flex w-full flex-1 flex-col items-center px-4 pt-4 pb-16 sm:px-6" role="region" aria-label="Contenido legal">
                <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-app-soft bg-app-surface-strong shadow-xl shadow-bluvi-purple/10 backdrop-blur-md" tabIndex={0} aria-label="Documento legal">
                    {children}
                </div>
            </div>

            <footer className="mt-auto mb-8 w-full text-center text-xs font-medium tracking-wide text-app-muted" role="contentinfo">
                &copy; {new Date().getFullYear()} Bluvi. Proyecto academico sin animo de lucro.
            </footer>
        </main>
    );
};

export default LegalLayout;
