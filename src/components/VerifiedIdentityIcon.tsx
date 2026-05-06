import type React from 'react';
import { ShieldUser } from 'lucide-react';
import { Tooltip, TooltipTrigger, Button as AriaButton } from './Tooltip';

const tooltipText = 'Perfil real con verificación de identidad';

interface VerifiedIdentityIconProps {
    className?: string;
    iconClassName?: string;
    variant?: 'button' | 'static';
}

export const VerifiedIdentityIcon: React.FC<VerifiedIdentityIconProps> = ({
    className = '',
    iconClassName = 'h-7 w-7',
    variant = 'button',
}) => {
    if (variant === 'static') {
        return (
            <span
                className={`inline-flex items-center justify-center text-app-accent-strong dark:text-app-orange ${className}`}
                aria-label={tooltipText}
                title={tooltipText}
            >
                <ShieldUser className={iconClassName} aria-hidden="true" strokeWidth={2.5} />
            </span>
        );
    }

    return (
        <TooltipTrigger delay={300}>
            <AriaButton
                className={`inline-flex items-center justify-center text-app-accent-strong transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-accent/20 dark:text-app-orange ${className}`}
                aria-label={tooltipText}
            >
                <ShieldUser className={iconClassName} aria-hidden="true" strokeWidth={2.5} />
            </AriaButton>
            <Tooltip>{tooltipText}</Tooltip>
        </TooltipTrigger>
    );
};
