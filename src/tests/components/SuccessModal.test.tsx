import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SuccessModal } from '../../components/SuccessModal';

vi.mock('react-aria-components', () => ({
    ModalOverlay: ({
        children,
        isOpen,
        onOpenChange,
        className,
    }: {
        children: React.ReactNode;
        isOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        className?: string;
    }) => isOpen ? (
        <div data-testid="modal-overlay" className={className}>
            <button type="button" onClick={() => onOpenChange?.(false)}>Dismiss overlay</button>
            {children}
        </div>
    ) : null,
    Modal: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    Dialog: ({ children, role, className }: { children: React.ReactNode; role?: string; className?: string }) => (
        <section role={role} className={className}>{children}</section>
    ),
    Heading: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <h2 className={className}>{children}</h2>
    ),
}));

describe('SuccessModal', () => {
    it('does not render when closed', () => {
        render(<SuccessModal isOpen={false} onClose={vi.fn()} />);

        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('renders the verification copy and closes from the primary button', () => {
        const onClose = vi.fn();

        render(<SuccessModal isOpen onClose={onClose} />);

        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /revisa tu bandeja/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /entendido/i }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the overlay is dismissed', () => {
        const onClose = vi.fn();

        render(<SuccessModal isOpen onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: /dismiss overlay/i }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
