import React from 'react';
import { Outlet } from 'react-router-dom';

export const ChatLayout: React.FC = () => {
    return (
        <main className="min-h-screen w-full bg-bluvi-gradient font-sans overflow-hidden">
            <Outlet />
        </main>
    );
};