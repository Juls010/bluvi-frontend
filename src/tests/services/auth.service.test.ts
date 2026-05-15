import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../services/api';
import { authService, type RegisterPayload } from '../../services/auth.service';

vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('auth service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('checks whether an email is available', async () => {
        vi.mocked(api.post).mockResolvedValueOnce({ data: { exists: false } });

        await expect(authService.checkEmail('ada@example.com')).resolves.toEqual({ exists: false });

        expect(api.post).toHaveBeenCalledWith('/auth/check-email', { email: 'ada@example.com' });
    });

    it('loads registration metadata', async () => {
        const metadata = { success: true, data: { genders: [{ id: 1, name: 'Mujer' }] } };
        vi.mocked(api.get).mockResolvedValueOnce({ data: metadata });

        await expect(authService.getMetadata()).resolves.toEqual(metadata);

        expect(api.get).toHaveBeenCalledWith('/auth/metadata');
    });

    it('registers a new user with the backend payload', async () => {
        const payload: RegisterPayload = {
            email: 'ada@example.com',
            password: 'Password123!',
            first_name: 'Ada',
            last_name: 'Lovelace',
            birth_date: '1990-01-01',
            id_gender: 1,
            id_preference: 2,
            city: 'Madrid',
            description: 'Hola',
            interests: [1],
            neurodivergences: [2],
            communication_style: [3],
            photos: ['https://example.test/a.png'],
            privacy_accepted_at: '2026-05-14T00:00:00.000Z',
            privacy_version: 'v1.0',
        };
        vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

        await expect(authService.register(payload)).resolves.toEqual({ success: true });

        expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
    });

    it('logs in and verifies email', async () => {
        vi.mocked(api.post)
            .mockResolvedValueOnce({ data: { success: true, accessToken: 'token' } })
            .mockResolvedValueOnce({ data: { success: true } });

        await expect(authService.login({ email: 'ada@example.com', password: 'Password123!' })).resolves.toEqual({
            success: true,
            accessToken: 'token',
        });
        await expect(authService.verifyEmail('123456', 'ada@example.com')).resolves.toEqual({ success: true });

        expect(api.post).toHaveBeenNthCalledWith(1, '/auth/login', { email: 'ada@example.com', password: 'Password123!' });
        expect(api.post).toHaveBeenNthCalledWith(2, '/auth/verify-email', { code: '123456', email: 'ada@example.com' });
    });

    it('clears local session on successful logout', async () => {
        localStorage.setItem('accessToken', 'token');
        localStorage.setItem('user', '{"id":1}');
        vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

        await authService.logout();

        expect(api.post).toHaveBeenCalledWith('/auth/logout');
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('clears local session even when logout request fails', async () => {
        const originalError = console.error;
        console.error = vi.fn();
        localStorage.setItem('accessToken', 'token');
        localStorage.setItem('user', '{"id":1}');
        vi.mocked(api.post).mockRejectedValueOnce(new Error('network'));

        await authService.logout();

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        console.error = originalError;
    });
});
