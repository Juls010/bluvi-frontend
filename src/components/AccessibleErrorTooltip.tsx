import React from 'react';
import { WarningCircleIcon } from '@phosphor-icons/react';

interface AccessibleErrorTooltipProps {
    id: string;
    message: string;
    className?: string;
}

export const AccessibleErrorTooltip: React.FC<AccessibleErrorTooltipProps> = ({ id, message, className = '' }) => {
    if (!message) return null;

    return (
        <div
            id={id}
            role="alert"
            aria-live="assertive"
            className={`w-full rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm ${className}`}
        >
            <div className="flex items-start gap-2">
                <WarningCircleIcon size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                <p className="font-medium leading-relaxed">{message}</p>
            </div>
        </div>
    );
};
