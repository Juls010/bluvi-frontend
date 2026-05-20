import React from 'react';

interface RegisterStepHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    align?: 'left' | 'center';
    compact?: boolean;
    compactOnShort?: boolean;
    className?: string;
}

export const RegisterStepHeader: React.FC<RegisterStepHeaderProps> = ({
    title,
    subtitle,
    align = 'left',
    compact = false,
    compactOnShort = false,
    className = '',
}) => {
    const alignmentClass = align === 'center' ? 'text-center' : 'text-left';
    const headerHeightClass = !subtitle
        ? 'min-h-0'
        : compact
            ? 'min-h-[80px] md:min-h-[90px]'
            : compactOnShort
                ? 'min-h-[100px] md:min-h-[110px] [@media(max-height:1000px)]:min-h-[70px]'
                : 'min-h-[100px] md:min-h-[110px]';
    const subtitleMinHeightClass = !subtitle
        ? 'min-h-0'
        : compact
            ? 'min-h-[30px]'
            : compactOnShort
                ? 'min-h-[48px] [@media(max-height:1000px)]:min-h-[20px]'
                : 'min-h-[48px]';
    const subtitleTextClass = compact
        ? 'text-bluvi-purple/70 text-base md:text-lg font-medium'
        : compactOnShort
            ? 'text-bluvi-purple/70 text-xl font-medium [@media(max-height:1000px)]:text-sm'
            : 'text-bluvi-purple/70 text-xl font-medium';

    return (
        <header className={`w-full ${alignmentClass} ${headerHeightClass} ${className}`}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                {title}
            </h1>
            <div className={subtitleMinHeightClass}>
                {subtitle ? <div className={subtitleTextClass}>{subtitle}</div> : null}
            </div>
        </header>
    );
};
