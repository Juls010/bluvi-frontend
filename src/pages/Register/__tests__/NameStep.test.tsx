import { render, screen, fireEvent } from '@testing-library/react';
import { NameStep } from '../NameStep';
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

describe('NameStep Component', () => {
    const mockUpdateFormData = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useRegister as any).mockReturnValue({
            formData: {
                firstName: '',
                lastName: '',
            },
            updateFormData: mockUpdateFormData,
        });
    });

    it('should capitalize name as the user types', () => {
        render(
            <MemoryRouter>
                <NameStep />
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText(/nombre/i);
        fireEvent.change(firstNameInput, { target: { value: 'aurora' } });

        expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: 'Aurora' });
    });

    it('should handle multi-word names with capitalization', () => {
        render(
            <MemoryRouter>
                <NameStep />
            </MemoryRouter>
        );

        const firstNameInput = screen.getByLabelText(/nombre/i);
        fireEvent.change(firstNameInput, { target: { value: 'maría josé' } });

        expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: 'María José' });
    });

    it('should navigate to /register/age when valid and clicking continue', () => {
        (useRegister as any).mockReturnValue({
            formData: {
                firstName: 'Aurora',
                lastName: 'Montenegro',
            },
            updateFormData: mockUpdateFormData,
        });

        render(
            <MemoryRouter>
                <NameStep />
            </MemoryRouter>
        );

        const nextButton = screen.getByRole('button', { name: /siguiente/i });
        fireEvent.click(nextButton);

        expect(mockNavigate).toHaveBeenCalledWith('/register/age');
    });
});
