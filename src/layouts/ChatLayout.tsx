import React from 'react';
import { Outlet } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const ChatLayout: React.FC = () => {
    useScrollToTop();

    React.useEffect(() => {
        document.documentElement.classList.add('chat-scroll-lock');
        document.body.classList.add('chat-scroll-lock');

        return () => {
            document.documentElement.classList.remove('chat-scroll-lock');
            document.body.classList.remove('chat-scroll-lock');
        };
    }, []);

    return (
        <main className="h-[100dvh] min-h-[100svh] w-full bg-app-gradient text-app-primary font-sans overflow-hidden overscroll-none">
            <Outlet />
        </main>
    );
};
