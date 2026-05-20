import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-app-surface">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-bluvi-purple border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/app/home" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
