import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgeStep } from '../AgeStep';
import { useRegister } from '../../../context/RegisterContext';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../../context/RegisterContext');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('AgeStep Component', () => {
    const mockUpdateFormData = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useRegister as any).mockReturnValue({
            formData: {
                birthDate: '',
            },
            updateFormData: mockUpdateFormData,
        });

        vi.useFakeTimers();
        const date = new Date(2024, 3, 20); // 2024-04-20
        vi.setSystemTime(date);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render titles and instructions', () => {
        render(
            <MemoryRouter>
                <AgeStep />
            </MemoryRouter>
        );
        expect(screen.getByText('¿Cuándo naciste?')).toBeDefined();
        expect(screen.getByText(/Debes tener al menos 18 años/i)).toBeDefined();
    });

    it('should show error if user is under 18', async () => {
        (useRegister as any).mockReturnValue({
            formData: {
                birthDate: '2010-01-01',
            },
            updateFormData: mockUpdateFormData,
        });

        render(
            <MemoryRouter>
                <AgeStep />
            </MemoryRouter>
        );

        const nextButton = screen.getByRole('button', { name: /siguiente/i });
        fireEvent.click(nextButton);

        expect(screen.getByText(/Debes tener al menos 18 años para unirte a Bluvi/i)).toBeDefined();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should navigate to /register/gender if user is 18 or older', async () => {
        (useRegister as any).mockReturnValue({
            formData: {
                birthDate: '1990-01-01',
            },
            updateFormData: mockUpdateFormData,
        });

        render(
            <MemoryRouter>
                <AgeStep />
            </MemoryRouter>
        );

        const nextButton = screen.getByRole('button', { name: /siguiente/i });
        fireEvent.click(nextButton);

        expect(mockNavigate).toHaveBeenCalledWith('/register/gender');
    });

    it('should show error if date is empty', () => {
        render(
            <MemoryRouter>
                <AgeStep />
            </MemoryRouter>
        );

        const nextButton = screen.getByRole('button', { name: /siguiente/i });
        fireEvent.click(nextButton);

        expect(screen.getByText(/Por favor, selecciona tu fecha de nacimiento/i)).toBeDefined();
    });
});
