import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { authService } from '../../services/auth.service';

vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('../../services/auth.service', () => ({
    authService: {
        logout: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('loads a stored session on mount', async () => {
        localStorage.setItem('accessToken', 'stored-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, email: 'ada@example.com' }));

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('stored-token');
        expect(result.current.user?.email).toBe('ada@example.com');
    });

    it('logs in and persists the access token and user', async () => {
        vi.mocked(api.post).mockResolvedValueOnce({
            data: {
                success: true,
                accessToken: 'fresh-token',
                user: { id: 2, email: 'grace@example.com' },
            },
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        let loginResult = false;
        await act(async () => {
            loginResult = await result.current.login({ email: 'grace@example.com', password: 'Password123!' });
        });

        expect(loginResult).toBe(true);
        expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'grace@example.com', password: 'Password123!' });
        expect(localStorage.getItem('accessToken')).toBe('fresh-token');
        expect(result.current.user?.email).toBe('grace@example.com');
    });

    it('clears local state and storage on logout', async () => {
        localStorage.setItem('accessToken', 'stored-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, email: 'ada@example.com' }));
        vi.mocked(authService.logout).mockResolvedValueOnce(undefined);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

        await act(async () => {
            result.current.logout();
        });

        await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(result.current.user).toBeNull();
    });
});
