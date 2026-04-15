import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const WelcomeLayout = () => {
    useScrollToTop();
    return (
        <main className="relative min-h-screen w-full flex flex-col">
            <div className="flex-grow flex flex-col items-center w-full">
                <AnimatePresence mode="wait">
                    <div 
                        key={location.pathname} 
                        className="w-full h-full flex flex-col items-center"
                    >
                        <Outlet />
                    </div>
                </AnimatePresence>
            </div>
        
        </main>
    );
};
