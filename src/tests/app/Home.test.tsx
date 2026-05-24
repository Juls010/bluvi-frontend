import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Home } from '../../pages/App/Home';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { HOME_EVENTS } from '../../data/events';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../context/NotificationContext', () => ({
    useNotifications: vi.fn(),
}));

vi.mock('../../components/BluAssistant', () => ({
    BluAssistant: () => <div data-testid="blu-assistant" />,
}));

vi.mock('../../components/NarrationButton', () => ({
    NarrationButton: ({ label }: { label: string }) => <button type="button">{label}</button>,
}));

describe('Home page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({
            user: { id: 1, email: 'ada@example.com', first_name: 'Ada Lovelace', id_gender: 1 },
            token: 'token',
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            setAuthenticatedSession: vi.fn(),
            logout: vi.fn(),
        });
        vi.mocked(useNotifications).mockReturnValue({
            unreadMessages: 0,
            pendingMatchRequests: 0,
            pendingRequestNames: [],
            hasNotifications: false,
            refreshNotifications: vi.fn(),
        });
    });

    it('greets the authenticated user by first name', () => {
        render(<Home />);

        expect(screen.getByRole('heading', { name: /bienvenida,\s*ada/i })).toBeInTheDocument();
        expect(screen.getByText(/todo esta en calma|todo está en calma/i)).toBeInTheDocument();
    });

    it('summarizes pending activity in the shortcut button', () => {
        vi.mocked(useNotifications).mockReturnValue({
            unreadMessages: 2,
            pendingMatchRequests: 1,
            pendingRequestNames: ['Grace Hopper'],
            hasNotifications: true,
            refreshNotifications: vi.fn(),
        });

        render(<Home />);

        expect(screen.getByText(/2 mensajes nuevos y 1 solicitud/i)).toBeInTheDocument();
    });

    it('navigates from the primary action buttons', () => {
        render(<Home />);

        fireEvent.click(screen.getByRole('button', { name: /explorar perfiles nuevos/i }));
        fireEvent.click(screen.getByRole('button', { name: /revisar tus conversaciones/i }));
        fireEvent.click(screen.getByRole('button', { name: /ajustar mi espacio/i }));

        expect(mockNavigate).toHaveBeenNthCalledWith(1, '/app/discovery');
        expect(mockNavigate).toHaveBeenNthCalledWith(2, '/app/messages');
        expect(mockNavigate).toHaveBeenNthCalledWith(3, '/app/profile');
    });

    it('renders the Bluvi events carousel content', () => {
        render(<Home />);

        expect(screen.getByRole('region', { name: /novedades de bluvi/i })).toBeInTheDocument();
        expect(screen.getByText(HOME_EVENTS[0].title)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /escuchar novedad/i })).toBeInTheDocument();
    });

    it('handles carousel controls and footer navigation', () => {
        const scrollTo = vi.fn();
        render(<Home />);

        const carouselScroller = screen.getByRole('region', { name: /novedades de bluvi/i })
            .querySelector('.overflow-x-auto') as HTMLDivElement;
        Object.defineProperty(carouselScroller, 'offsetWidth', { configurable: true, value: 320 });
        carouselScroller.scrollTo = scrollTo;

        const previousButton = screen.getByRole('button', { name: /ver novedad anterior/i });
        fireEvent.mouseEnter(previousButton);
        fireEvent.mouseLeave(previousButton);
        fireEvent.click(previousButton);
        fireEvent.click(screen.getByRole('button', { name: /ver siguiente novedad/i }));

        expect(scrollTo).toHaveBeenCalledWith({ left: 320 * (HOME_EVENTS.length - 1), behavior: 'smooth' });
        expect(scrollTo).toHaveBeenCalledWith({ left: 320, behavior: 'smooth' });

        fireEvent.click(screen.getByRole('button', { name: /privacidad/i }));
        fireEvent.click(screen.getByRole('button', { name: /t.rminos/i }));
        fireEvent.click(screen.getByRole('button', { name: /cookies/i }));
        fireEvent.click(screen.getByRole('button', { name: /accesibilidad/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/privacidad', { state: { fromFooter: true, returnTo: '/app/home' } });
        expect(mockNavigate).toHaveBeenCalledWith('/terminos', { state: { fromFooter: true, returnTo: '/app/home' } });
        expect(mockNavigate).toHaveBeenCalledWith('/cookies', { state: { fromFooter: true, returnTo: '/app/home' } });
        expect(mockNavigate).toHaveBeenCalledWith('/accesibilidad', { state: { fromFooter: true, returnTo: '/app/home' } });
    });
});
