import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GenderStep } from '../GenderStep';
import { SexualityStep } from '../SexualityStep';
import { NeurodivergenceStep } from '../NeurodivergenceStep';
import { InterestsStep } from '../InterestsStep';
import { CommunicationStyleStep } from '../CommunicationsStyleStep';
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

const mockMetadata = {
    success: true,
    data: {
        genders: [
            { id: 1, name: 'Hombre' },
            { id: 2, name: 'Mujer' }
        ],
        sexualities: [
            { id: 1, name: 'Heterosexual' },
            { id: 2, name: 'Bisexual' }
        ],
        neurodivergences: [
            { id: 1, name: 'Autismo' },
            { id: 2, name: 'TDAH' }
        ],
        interests: [
            { id: 1, name: 'Anime' },
            { id: 2, name: 'Música' }
        ],
        communicationStyles: [
            { id: 1, name: 'Directo/a' },
            { id: 2, name: 'Escucha activa' }
        ]
    }
};

describe('Selection Registration Steps', () => {
    const mockUpdateFormData = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (authService.getMetadata as any).mockResolvedValue(mockMetadata);
        (useRegister as any).mockReturnValue({
            formData: {
                gender: '',
                sexuality: '',
                neurodivergences: [],
                interests: [],
                communicationStyle: [],
            },
            updateFormData: mockUpdateFormData,
        });
    });

    describe('GenderStep', () => {
        it('should render gender options and select one', async () => {
            render(
                <MemoryRouter>
                    <GenderStep />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Hombre')).toBeDefined();
                expect(screen.getByText('Mujer')).toBeDefined();
            });

            fireEvent.click(screen.getByText('Hombre'));
            expect(mockUpdateFormData).toHaveBeenCalledWith({ gender: 1 });
        });

        it('should navigate to sexuality step after selection', async () => {
            (useRegister as any).mockReturnValue({
                formData: { gender: 1 },
                updateFormData: mockUpdateFormData,
            });

            render(
                <MemoryRouter>
                    <GenderStep />
                </MemoryRouter>
            );

            const nextButton = screen.getByRole('button', { name: /siguiente/i });
            fireEvent.click(nextButton);
            expect(mockNavigate).toHaveBeenCalledWith('/register/sexuality');
        });
    });

    describe('SexualityStep', () => {
        it('should render sexuality options and select one', async () => {
            render(
                <MemoryRouter>
                    <SexualityStep />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Heterosexual')).toBeDefined();
            });

            fireEvent.click(screen.getByText('Heterosexual'));
            expect(mockUpdateFormData).toHaveBeenCalledWith({ sexuality: 1 });
        });
    });

    describe('NeurodivergenceStep', () => {
        it('should allow multiple selection and toggling', async () => {
            (useRegister as any).mockReturnValue({
                formData: { neurodivergences: [1] },
                updateFormData: mockUpdateFormData,
            });

            render(
                <MemoryRouter>
                    <NeurodivergenceStep />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Autismo')).toBeDefined();
                expect(screen.getByText('TDAH')).toBeDefined();
            });

            
            fireEvent.click(screen.getByText('Autismo'));
            expect(mockUpdateFormData).toHaveBeenCalledWith({ neurodivergences: [] });

            
        });

        it('should allow skipping (omitir) if none selected', () => {
             render(
                <MemoryRouter>
                    <NeurodivergenceStep />
                </MemoryRouter>
            );
            
            const skipButton = screen.getByText('Omitir');
            fireEvent.click(skipButton);
            expect(mockNavigate).toHaveBeenCalledWith('/register/communication');
        });
    });

    describe('InterestsStep', () => {
        it('should allow multi-selection of interests', async () => {
            (useRegister as any).mockReturnValue({
                formData: { interests: [1] },
                updateFormData: mockUpdateFormData,
            });

            render(
                <MemoryRouter>
                    <InterestsStep />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Anime')).toBeDefined();
            });

            fireEvent.click(screen.getByText('Anime'));
            expect(mockUpdateFormData).toHaveBeenCalledWith({ interests: [] });
        });
    });

    describe('CommunicationStyleStep', () => {
        it('should render and select communication style', async () => {
            render(
                <MemoryRouter>
                    <CommunicationStyleStep />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Directo/a')).toBeDefined();
            });

            fireEvent.click(screen.getByText('Directo/a'));
            expect(mockUpdateFormData).toHaveBeenCalledWith({ communicationStyle: [1] });
        });
    });
});
