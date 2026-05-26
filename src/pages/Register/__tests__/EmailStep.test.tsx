import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailStep } from '../EmailStep';
import { useRegister } from '../../../context/RegisterContext';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../../context/RegisterContext');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});
vi.mock('../../../services/auth.service');

describe('EmailStep Component', () => {
    const mockUpdateFormData = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useRegister as any).mockReturnValue({
            formData: {
                email: '',
                password: '',
                privacyAccepted: false,
            },
            updateFormData: mockUpdateFormData,
        });
    });

    it('should render correct titles and inputs', () => {
        render(
            <MemoryRouter>
                <EmailStep />
            </MemoryRouter>
        );
        expect(screen.getByText('Crea tu cuenta')).toBeDefined();
        expect(screen.getByLabelText('Correo Electrónico')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
        expect(screen.getByRole('checkbox')).toBeDefined();
    });

    it('should show error when clicking continue without privacy consent', async () => {
        (useRegister as any).mockReturnValue({
            formData: {
                email: 'test@example.com',
                password: 'Password123!',
                privacyAccepted: false,
            },
            updateFormData: mockUpdateFormData,
        });

        render(
            <MemoryRouter>
                <EmailStep />
            </MemoryRouter>
        );

        const continueButton = screen.getByRole('button', { name: /continuar/i });
        fireEvent.click(continueButton);

        const consentText = screen.getByText(/He leído y acepto la/i);
        expect(consentText.className).toContain('text-red-400');
    });

    it('should call checkEmail and navigate when everything is valid', async () => {
        (useRegister as any).mockReturnValue({
            formData: {
                email: 'test@example.com',
                password: 'Password123!',
                privacyAccepted: true,
            },
            updateFormData: mockUpdateFormData,
        });

        (authService.checkEmail as any).mockResolvedValue({ exists: false });

        render(
            <MemoryRouter>
                <EmailStep />
            </MemoryRouter>
        );

        const continueButton = screen.getByRole('button', { name: /continuar/i });
        fireEvent.click(continueButton);

        await waitFor(() => {
            expect(authService.checkEmail).toHaveBeenCalledWith('test@example.com');
            expect(mockNavigate).toHaveBeenCalledWith('/register/photos');
        });
    });

    it('should show server error if checkEmail fails', async () => {
        (useRegister as any).mockReturnValue({
            formData: {
                email: 'test@example.com',
                password: 'Password123!',
                privacyAccepted: true,
            },
            updateFormData: mockUpdateFormData,
        });

        (authService.checkEmail as any).mockRejectedValue(new Error('Network Error'));

        render(
            <MemoryRouter>
                <EmailStep />
            </MemoryRouter>
        );

        const continueButton = screen.getByRole('button', { name: /continuar/i });
        fireEvent.click(continueButton);

        await waitFor(() => {
            expect(screen.getByText(/Error al verificar el correo/i)).toBeDefined();
        });
    });
});
