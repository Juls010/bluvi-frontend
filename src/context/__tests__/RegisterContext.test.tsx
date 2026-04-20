import { renderHook, act } from '@testing-library/react';
import { RegisterProvider, useRegister } from '../RegisterContext';
import { authService } from '../../services/auth.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../../services/auth.service');

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RegisterProvider>{children}</RegisterProvider>
);

describe('RegisterContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with default data when localStorage is empty', () => {
        const { result } = renderHook(() => useRegister(), { wrapper });
        expect(result.current.formData.firstName).toBe('');
        expect(result.current.formData.photos.length).toBe(5);
    });

    it('should load data from localStorage on initialization', () => {
        const backupData = {
            firstName: 'Aurora',
            lastName: 'Montenegro',
            email: 'aurora@example.com'
        };
        localStorage.setItem('bluvi_reg_backup', JSON.stringify(backupData));

        const { result } = renderHook(() => useRegister(), { wrapper });
        expect(result.current.formData.firstName).toBe('Aurora');
        expect(result.current.formData.email).toBe('aurora@example.com');
    });

    it('should update state and save to localStorage on updateFormData', () => {
        const { result } = renderHook(() => useRegister(), { wrapper });

        act(() => {
            result.current.updateFormData({ firstName: 'Julieta' });
        });

        expect(result.current.formData.firstName).toBe('Julieta');
        const saved = JSON.parse(localStorage.getItem('bluvi_reg_backup') || '{}');
        expect(saved.firstName).toBe('Julieta');
    });

    it('should sanitize inputs and respect max lengths', () => {
        const { result } = renderHook(() => useRegister(), { wrapper });

        act(() => {
            result.current.updateFormData({ 
                firstName: '<b>Aurora</b>\u0000', 
                email: ' test@example.com ',
                photos: Array(10).fill('data:image/png;base64,xxx')
            });
        });

        // HTML tags should be kept by sanitizePlainText (it only removes control chars), 
        // but let's check what the actual implementation does.
        // It uses: value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLength);
        expect(result.current.formData.firstName).toBe('<b>Aurora</b>');
        // Email should remove whitespace and be limited
        expect(result.current.formData.email).toBe('test@example.com');
        // Photos should be limited to 5
        expect(result.current.formData.photos.length).toBe(5);
    });

    describe('sendToBackend', () => {
        it('should correctly map data and call authService.register', async () => {
            const { result } = renderHook(() => useRegister(), { wrapper });

            act(() => {
                result.current.updateFormData({
                    firstName: 'Aurora',
                    lastName: 'Montenegro',
                    email: 'aurora@example.com',
                    password: 'Password123!',
                    birthDate: '1990-01-01',
                    gender: 1,
                    sexuality: 1,
                    city: 'Madrid',
                    description: 'Descripción de prueba',
                    privacyAccepted: true
                });
            });

            (authService.register as any).mockResolvedValue({ success: true });

            let success;
            await act(async () => {
                success = await result.current.sendToBackend();
            });

            expect(success).toBe(true);
            expect(authService.register).toHaveBeenCalledWith(expect.objectContaining({
                first_name: 'Aurora',
                email: 'aurora@example.com',
                id_gender: 1,
                privacy_version: 'v1.0'
            }));
        });

        it('should throw validation error if required fields are missing', async () => {
            const { result } = renderHook(() => useRegister(), { wrapper });

            // Missing password and names
            await expect(result.current.sendToBackend()).rejects.toThrow(/El correo no es valido/i);
        });

        it('should handle API errors and re-throw with message', async () => {
            const { result } = renderHook(() => useRegister(), { wrapper });

            act(() => {
                result.current.updateFormData({
                    firstName: 'Aurora',
                    lastName: 'Montenegro',
                    email: 'aurora@example.com',
                    password: 'Password123!',
                    birthDate: '1990-01-01',
                    gender: 1,
                    sexuality: 1,
                    city: 'Madrid',
                    description: 'Descripción de prueba',
                    privacyAccepted: true
                });
            });

            (authService.register as any).mockRejectedValue({
                response: { data: { message: 'El email ya existe' } }
            });

            await expect(result.current.sendToBackend()).rejects.toThrow('El email ya existe');
        });
    });
});
