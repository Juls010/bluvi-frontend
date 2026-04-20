import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterProvider, useRegister } from '../../../context/RegisterContext';
import { NameStep } from '../NameStep';
import { AgeStep } from '../AgeStep';
import { GenderStep } from '../GenderStep';
import { SexualityStep } from '../SexualityStep';
import { NeurodivergenceStep } from '../NeurodivergenceStep';
import { CommunicationStyleStep } from '../CommunicationsStyleStep';
import { EmailStep } from '../EmailStep';
import { PhotoUploadStep } from '../PhotoUploadStep';
import { LocationStep } from '../LocationStep';
import { InterestsStep } from '../InterestsStep';
import { ProfileDescriptionStep } from '../ProfileDescriptionStep';
import { EmailVerificationStep } from '../EmailVerificationStep';
import { SafetyTipsStep } from '../SafetyTipsStep';
import { authService } from '../../../services/auth.service';
import { searchCities } from '../../../services/cities.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// 1. Agressive Mocks for environment-incompatible components
vi.mock('framer-motion', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        motion: {
            ...actual.motion,
            div: ({ children, props }: any) => <div {...props}>{children}</div>,
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// Mock PhotoUploadStep to avoid FileReader jsdom issues in a long integration test
vi.mock('../PhotoUploadStep', () => ({
    PhotoUploadStep: () => {
        const { updateFormData } = useRegister();
        const navigate = useNavigate();
        return (
            <div>
                <h1>Muestra tu esencia</h1>
                <button aria-label="Continuar" onClick={() => {
                    updateFormData({ photos: ['data:image/png;base64,mock', null, null, null, null] });
                    navigate('/register/location');
                }}>Continuar</button>
            </div>
        );
    }
}));

vi.mock('../../../services/auth.service');
vi.mock('../../../services/cities.service');

const LocationDisplay = () => {
    const { pathname } = useLocation();
    return <div data-testid="location-display">{pathname}</div>;
};

const FullFlowWrapper = () => (
    <RegisterProvider>
        <LocationDisplay />
        <Routes>
            <Route path="/register/name" element={<NameStep />} />
            <Route path="/register/age" element={<AgeStep />} />
            <Route path="/register/gender" element={<GenderStep />} />
            <Route path="/register/sexuality" element={<SexualityStep />} />
            <Route path="/register/neurodivergence" element={<NeurodivergenceStep />} />
            <Route path="/register/communication" element={<CommunicationStyleStep />} />
            <Route path="/register/email" element={<EmailStep />} />
            <Route path="/register/photos" element={<PhotoUploadStep />} />
            <Route path="/register/location" element={<LocationStep />} />
            <Route path="/register/interests" element={<InterestsStep />} />
            <Route path="/register/description" element={<ProfileDescriptionStep />} />
            <Route path="/register/verificationemail" element={<EmailVerificationStep />} />
            <Route path="/register/safety-tips" element={<SafetyTipsStep />} />
            <Route path="/app/home" element={<div>Welcome Home</div>} />
        </Routes>
    </RegisterProvider>
);

describe('Full Registration Integration Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        (authService.getMetadata as any).mockResolvedValue({
            success: true,
            data: {
                genders: [{ id: 1, name: 'Hombre' }],
                sexualities: [{ id: 1, name: 'Heterosexual' }],
                neurodivergences: [{ id: 1, name: 'TDAH' }],
                communicationStyles: [{ id: 1, name: 'Directo' }],
                interests: [{ id: 1, name: 'Cine' }, { id: 2, name: 'Música' }]
            }
        });
        (authService.checkEmail as any).mockResolvedValue({ exists: false });
        (authService.register as any).mockResolvedValue({ success: true });
        (authService.verifyEmail as any).mockResolvedValue({ success: true });
        (searchCities as any).mockResolvedValue([{ id: 1, label: 'Madrid, España', value: 'Madrid' }]);
    });

    it('should complete the entire registration process successfully', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter initialEntries={['/register/name']}>
                <FullFlowWrapper />
            </MemoryRouter>
        );

        const expectRoute = async (route: string) => {
            await waitFor(() => expect(screen.getByTestId('location-display').textContent).toBe(route), { timeout: 4000 });
        };

        // 1. Name
        await user.type(screen.getByLabelText(/^Nombre$/i), 'Aurora');
        await user.type(screen.getByLabelText(/^Apellidos$/i), 'Montenegro');
        await user.click(screen.getByRole('button', { name: /siguiente/i }));
        await expectRoute('/register/age');

        // 2. Age - Setting hidden input directly for reliability
        const hiddenDateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        fireEvent.change(hiddenDateInput, { target: { value: '1990-01-01' } });
        await user.click(screen.getByRole('button', { name: /ir al siguiente paso/i }));
        await expectRoute('/register/gender');

        // 3-6 Selection Steps
        await user.click(await screen.findByText('Hombre'));
        await user.click(screen.getByRole('button', { name: /siguiente paso/i }));
        await expectRoute('/register/sexuality');

        await user.click(await screen.findByText('Heterosexual'));
        await user.click(screen.getByRole('button', { name: /siguiente paso/i }));
        await expectRoute('/register/neurodivergence');

        await user.click(await screen.findByText('TDAH'));
        await user.click(screen.getByRole('button', { name: /siguiente paso/i }));
        await expectRoute('/register/communication');

        await user.click(await screen.findByText('Directo'));
        await user.click(screen.getByRole('button', { name: /siguiente paso/i }));
        await expectRoute('/register/email');

        // 7. Email
        await user.type(screen.getByLabelText(/^Correo Electrónico$/i), 'aurora@example.com');
        await user.type(screen.getByLabelText(/^Contraseña$/i), 'Password123!');
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /continuar/i }));
        await expectRoute('/register/photos');

        // 8. Photos (Mocked component)
        await user.click(screen.getByRole('button', { name: /continuar/i }));
        await expectRoute('/register/location');

        // 9. Location
        await user.type(screen.getByLabelText(/Buscar ciudad/i), 'Mad');
        await user.click(await screen.findByText('Madrid, España'));
        await user.click(screen.getByRole('button', { name: /confirmar ciudad y continuar/i }));
        await expectRoute('/register/interests');

        // 10. Interests
        await user.click(await screen.findByText('Cine'));
        await user.click(await screen.findByText('Música'));
        await user.click(screen.getByRole('button', { name: /confirmar intereses y continuar/i }));
        await expectRoute('/register/description');

        // 11. Description
        await user.type(screen.getByLabelText(/Tu descripción personal/i), 'Descripción de prueba.');
        await user.click(screen.getByRole('button', { name: /^siguiente$/i }));
        await expectRoute('/register/verificationemail');

        // 12. Verification
        const codeInputs = screen.getAllByLabelText(/Dígito \d del código/i);
        for(let i=0; i<6; i++) await user.type(codeInputs[i], i.toString());
        await user.click(screen.getByRole('button', { name: /verificar y continuar/i }));
        await expectRoute('/register/safety-tips');

        // 13. Safety
        await user.click(screen.getByRole('button', { name: /entendido/i }));
        await expectRoute('/app/home');

        expect(authService.register).toHaveBeenCalled();
    });
});
