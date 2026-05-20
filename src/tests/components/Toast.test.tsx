import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from '../../components/Toast/Toast';
import { GlobalToastRegion, toastQueue } from '../../components/Toast/GlobalToast';

vi.mock('react-aria-components', () => ({
    UNSTABLE_Toast: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="toast" className={className}>{children}</div>
    ),
    UNSTABLE_ToastContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    UNSTABLE_ToastQueue: class MockToastQueue<T> {
        options: unknown;
        items: T[] = [];

        constructor(options: unknown) {
            this.options = options;
        }

        add(item: T) {
            this.items.push(item);
        }
    },
    UNSTABLE_ToastRegion: ({
        children,
        className,
        queue,
    }: {
        children: (props: { toast: { content: { message: string; type?: 'success' | 'error' } } }) => React.ReactNode;
        className?: string;
        queue: { items?: Array<{ message: string; type?: 'success' | 'error' }> };
    }) => (
        <section data-testid="toast-region" className={className}>
            {(queue.items ?? []).map((content, index) => (
                <div key={index}>{children({ toast: { content } })}</div>
            ))}
        </section>
    ),
}));

describe('Toast components', () => {
    it('renders a success toast with success styling', () => {
        render(<Toast toast={{ content: { message: 'Guardado', type: 'success' } }} />);

        expect(screen.getByText('Guardado')).toBeInTheDocument();
        expect(screen.getByTestId('toast')).toHaveClass('bg-bluvi-purple');
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders an error toast with error styling', () => {
        render(<Toast toast={{ content: { message: 'No se pudo guardar', type: 'error' } }} />);

        expect(screen.getByText('No se pudo guardar')).toBeInTheDocument();
        expect(screen.getByTestId('toast')).toHaveClass('bg-red-500');
    });

    it('renders queued toasts in the global region', () => {
        toastQueue.add({ message: 'Una notificacion', type: 'success' });

        render(<GlobalToastRegion />);

        expect(screen.getByTestId('toast-region')).toHaveClass('fixed');
        expect(screen.getByText('Una notificacion')).toBeInTheDocument();
    });
});
