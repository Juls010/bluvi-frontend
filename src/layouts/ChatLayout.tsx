import React from 'react';
import { Outlet } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const ChatLayout: React.FC = () => {
    useScrollToTop();
    return (
        <main className="min-h-screen w-full bg-app-gradient text-app-primary font-sans overflow-hidden">
            <Outlet />
        </main>
    );
};
