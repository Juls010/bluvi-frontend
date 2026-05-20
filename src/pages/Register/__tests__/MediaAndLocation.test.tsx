import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhotoUploadStep } from '../PhotoUploadStep';
import { LocationStep } from '../LocationStep';
import { ProfileDescriptionStep } from '../ProfileDescriptionStep';
import { useRegister } from '../../../context/RegisterContext';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { searchCities } from '../../../services/cities.service';
import { uploadUserPhoto } from '../../../services/uploadService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../../context/RegisterContext');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});
vi.mock('../../../services/cities.service');
vi.mock('../../../services/uploadService');

describe('Media and Location Registration Steps', () => {
    const mockUpdateFormData = vi.fn();
    const mockNavigate = vi.fn();
    const mockSendToBackend = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useRegister as any).mockReturnValue({
            formData: {
                photos: [null, null, null, null, null],
                city: '',
                description: '',
            },
            updateFormData: mockUpdateFormData,
            sendToBackend: mockSendToBackend,
        });
    });

    describe('PhotoUploadStep', () => {
        it('should render photo slots and primary photo instruction', () => {
            render(
                <MemoryRouter>
                    <PhotoUploadStep />
                </MemoryRouter>
            );
            expect(screen.getByLabelText(/Subir foto principal/i)).toBeDefined();
            expect(screen.getAllByLabelText(/Subir foto secundaria/i).length).toBe(4);
        });

        it('should allow removing a photo', () => {
             (useRegister as any).mockReturnValue({
                formData: {
                    photos: ['https://example.com/photo.jpg', null, null, null, null],
                },
                updateFormData: mockUpdateFormData,
            });

            render(
                <MemoryRouter>
                    <PhotoUploadStep />
                </MemoryRouter>
            );

            const removeButton = screen.getByLabelText(/Eliminar foto principal/i);
            fireEvent.click(removeButton);
            expect(mockUpdateFormData).toHaveBeenCalledWith({ photos: [null, null, null, null, null] });
        });

        it('should handle file selection and upload', async () => {
            const mockUrl = 'https://supabase.co/photo.jpg';
            (uploadUserPhoto as any).mockResolvedValue({ url: mockUrl, error: null });

            render(
                <MemoryRouter>
                    <PhotoUploadStep />
                </MemoryRouter>
            );

            const input = document.getElementById('register-file-input') as HTMLInputElement;
            const file = new File([''], 'test.png', { type: 'image/png' });
            
            fireEvent.click(screen.getByLabelText(/Subir foto principal/i));
            
            // Simular el cambio en el input de archivo
            fireEvent.change(input, { target: { files: [file] } });
            
            await waitFor(() => {
                expect(uploadUserPhoto).toHaveBeenCalledWith(file);
                expect(mockUpdateFormData).toHaveBeenCalledWith({
                    photos: [mockUrl, null, null, null, null]
                });
            });
        });
    });

    describe('LocationStep', () => {
        it('should search for cities and allow selection', async () => {
            (searchCities as any).mockResolvedValue([
                { id: 1, label: 'Madrid, España', value: 'Madrid' }
            ]);

            render(
                <MemoryRouter>
                    <LocationStep />
                </MemoryRouter>
            );

            const input = screen.getByLabelText('Buscar ciudad');
            fireEvent.change(input, { target: { value: 'Mad' } });

            await waitFor(() => {
                expect(screen.getByText('Madrid, España')).toBeDefined();
            });

            fireEvent.click(screen.getByText('Madrid, España'));
            expect(mockUpdateFormData).toHaveBeenLastCalledWith({ city: 'Madrid', cityLat: null, cityLng: null });
        });

        it('should allow keyboard navigation for city selection', async () => {
            (searchCities as any).mockResolvedValue([
                { id: 1, label: 'Madrid, España', value: 'Madrid' },
                { id: 2, label: 'Barcelona, España', value: 'Barcelona' }
            ]);

            render(
                <MemoryRouter>
                    <LocationStep />
                </MemoryRouter>
            );

            const input = screen.getByLabelText('Buscar ciudad');
            fireEvent.change(input, { target: { value: 'Ma' } });

            await waitFor(() => {
                expect(screen.getByText('Madrid, España')).toBeDefined();
            });

            // ArrowDown twice to Barcelona
            fireEvent.keyDown(input, { key: 'ArrowDown' });
            fireEvent.keyDown(input, { key: 'ArrowDown' });
            fireEvent.keyDown(input, { key: 'Enter' });

            expect(mockUpdateFormData).toHaveBeenLastCalledWith({ city: 'Barcelona', cityLat: null, cityLng: null });
        });
    });

    describe('ProfileDescriptionStep', () => {
        it('should update description and call sendToBackend on next', async () => {
            (useRegister as any).mockReturnValue({
                formData: { description: 'Hola, soy una descripción' },
                updateFormData: mockUpdateFormData,
                sendToBackend: mockSendToBackend.mockResolvedValue(true),
            });

            render(
                <MemoryRouter>
                    <ProfileDescriptionStep />
                </MemoryRouter>
            );

            const textarea = screen.getByLabelText('Tu descripción personal');
            fireEvent.change(textarea, { target: { value: 'Nueva descripción' } });
            expect(mockUpdateFormData).toHaveBeenCalledWith({ description: 'Nueva descripción' });

            const nextButton = screen.getByRole('button', { name: /siguiente/i });
            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(mockSendToBackend).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/register/verificationemail');
            });
        });

        it('should show error if sendToBackend fails', async () => {
            const errorMsg = 'El servidor no responde';
            (useRegister as any).mockReturnValue({
                formData: { description: 'Alguna descripción' },
                updateFormData: mockUpdateFormData,
                sendToBackend: mockSendToBackend.mockRejectedValue(new Error(errorMsg)),
            });

            render(
                <MemoryRouter>
                    <ProfileDescriptionStep />
                </MemoryRouter>
            );

            const nextButton = screen.getByRole('button', { name: /siguiente/i });
            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(errorMsg)).toBeDefined();
            });
        });
    });
});
