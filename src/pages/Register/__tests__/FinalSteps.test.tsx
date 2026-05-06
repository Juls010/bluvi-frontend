import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailVerificationStep } from '../EmailVerificationStep';
import { SafetyTipsStep } from '../SafetyTipsStep';
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

describe('Final Registration Steps', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useRegister as any).mockReturnValue({
            formData: {
                email: 'test@example.com',
            },
        });
    });

    describe('EmailVerificationStep', () => {
        it('should allow entering code and calling verifyEmail', async () => {
            (authService.verifyEmail as any).mockResolvedValue({ success: true });

            render(
                <MemoryRouter>
                    <EmailVerificationStep />
                </MemoryRouter>
            );

            const inputs = screen.getAllByLabelText(/Dígito \d del código/i);
            expect(inputs.length).toBe(6);

            // Fill the code
            inputs.forEach((input, i) => {
                fireEvent.change(input, { target: { value: i.toString() } });
            });

            const verifyButton = screen.getByRole('button', { name: /verificar y continuar/i });
            fireEvent.click(verifyButton);

            await waitFor(() => {
                expect(authService.verifyEmail).toHaveBeenCalledWith('012345', 'test@example.com');
                expect(mockNavigate).toHaveBeenCalledWith('/register/safety-tips');
            });
        });

        it('should show error if verification fails', async () => {
            (authService.verifyEmail as any).mockRejectedValue({
                response: { data: { message: 'Código inválido' } }
            });

            render(
                <MemoryRouter>
                    <EmailVerificationStep />
                </MemoryRouter>
            );

            const inputs = screen.getAllByLabelText(/Dígito \d del código/i);
            inputs.forEach((input) => {
                fireEvent.change(input, { target: { value: '1' } });
            });

            const verifyButton = screen.getByRole('button', { name: /verificar y continuar/i });
            fireEvent.click(verifyButton);

            await waitFor(() => {
                expect(screen.getByText(/Código inválido/i)).toBeDefined();
            });
        });

        it('should move focus forward when typing a digit and backward on backspace', () => {
            render(
                <MemoryRouter>
                    <EmailVerificationStep />
                </MemoryRouter>
            );

            const inputs = screen.getAllByLabelText(/Dígito \d del código/i) as HTMLInputElement[];
            
            // Initial focus check (it might not be focused automatically by default, let's see implementation)
            // The implementation doesn't auto-focus the first one on mount, but let's test the change logic.
            
            fireEvent.change(inputs[0], { target: { value: '1' } });
            expect(inputs[1]).toBe(document.activeElement);

            fireEvent.change(inputs[1], { target: { value: '2' } });
            expect(inputs[2]).toBe(document.activeElement);

            // Backspace on empty input 2 should move to input 1
            fireEvent.keyDown(inputs[2], { key: 'Backspace' });
            expect(inputs[1]).toBe(document.activeElement);
        });

        it('should ignore non-numeric characters', () => {
             render(
                <MemoryRouter>
                    <EmailVerificationStep />
                </MemoryRouter>
            );

            const inputs = screen.getAllByLabelText(/Dígito \d del código/i) as HTMLInputElement[];
            fireEvent.change(inputs[0], { target: { value: 'a' } });
            expect(inputs[0].value).toBe('');
        });
    });

    describe('SafetyTipsStep', () => {
        it('should navigate to app home on finish', () => {
            render(
                <MemoryRouter>
                    <SafetyTipsStep />
                </MemoryRouter>
            );

            const finishButton = screen.getByRole('button', { name: /entendido/i });
            fireEvent.click(finishButton);
            expect(mockNavigate).toHaveBeenCalledWith('/app/home');
        });
    });
});
