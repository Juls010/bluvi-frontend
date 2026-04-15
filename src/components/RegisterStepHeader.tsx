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
            ? 'min-h-[88px] md:min-h-[100px]'
            : compactOnShort
                ? 'min-h-[108px] md:min-h-[122px] [@media(max-height:900px)]:min-h-[88px]'
                : 'min-h-[108px] md:min-h-[122px]';
    const subtitleMinHeightClass = !subtitle
        ? 'min-h-0'
        : compact
            ? 'min-h-[36px]'
            : compactOnShort
                ? 'min-h-[52px] [@media(max-height:900px)]:min-h-[36px]'
                : 'min-h-[52px]';
    const subtitleTextClass = compact
        ? 'text-bluvi-purple/70 text-sm md:text-base font-medium'
        : compactOnShort
            ? 'text-bluvi-purple/70 text-lg font-medium [@media(max-height:900px)]:text-sm'
            : 'text-bluvi-purple/70 text-lg font-medium';

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
