import { fireEvent, render, screen } from '@testing-library/react';
import { parseDate } from '@internationalized/date';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../../components/DatePicker';

vi.mock('react-aria-components', () => ({
    DatePicker: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="date-picker" className={className}>{children}</div>
    ),
    Label: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <label className={className}>{children}</label>
    ),
    Group: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    DateInput: ({
        children,
        className,
    }: {
        children: (segment: { type: string; text: string }) => React.ReactNode;
        className?: string;
    }) => (
        <div className={className}>
            {children({ type: 'day', text: '14' })}
        </div>
    ),
    DateSegment: ({ segment, className }: { segment: { text: string }; className?: string }) => (
        <span className={className}>{segment.text}</span>
    ),
    Button: ({
        children,
        className,
        ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button type="button" className={className} {...props}>{children}</button>
    ),
    Text: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <p className={className}>{children}</p>
    ),
    Popover: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Calendar: ({
        children,
        onFocusChange,
        className,
    }: {
        children: React.ReactNode;
        onFocusChange?: (value: ReturnType<typeof parseDate>) => void;
        className?: string;
    }) => (
        <div className={className}>
            <button type="button" onClick={() => onFocusChange?.(parseDate('2020-05-14'))}>Focus calendar date</button>
            {children}
        </div>
    ),
    Heading: ({ className }: { className?: string }) => <h3 className={className}>May 2020</h3>,
    CalendarGrid: ({
        children,
        className,
    }: {
        children: (date: ReturnType<typeof parseDate>) => React.ReactNode;
        className?: string;
    }) => (
        <div className={className}>{children(parseDate('2020-05-14'))}</div>
    ),
    CalendarCell: ({ date, className }: { date: { toString: () => string }; className?: string }) => (
        <button type="button" className={className}>{date.toString()}</button>
    ),
}));

describe('DatePicker', () => {
    it('renders label, helper copy and error message', () => {
        render(
            <DatePicker
                label="Fecha de nacimiento"
                description="Selecciona tu fecha"
                errorMessage="Fecha obligatoria"
                value={parseDate('1990-01-01')}
            />
        );

        expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument();
        expect(screen.getByText('Selecciona tu fecha')).toBeInTheDocument();
        expect(screen.getByText('Fecha obligatoria')).toBeInTheDocument();
        expect(screen.getByText('2020-05-14')).toBeInTheDocument();
    });

    it('supports jumping one year from the current focused calendar value', () => {
        render(<DatePicker placeholderValue={parseDate('2020-05-14')} />);

        fireEvent.click(screen.getByRole('button', { name: /ir al ano anterior/i }));
        fireEvent.click(screen.getByRole('button', { name: /focus calendar date/i }));
        fireEvent.click(screen.getByRole('button', { name: /ir al ano siguiente/i }));

        expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });
});
