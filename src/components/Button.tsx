import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

const NON_COLOR_TEXT_CLASSES = new Set([
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
    'text-left',
    'text-center',
    'text-right',
    'text-justify',
    'text-start',
    'text-end',
    'text-wrap',
    'text-nowrap',
    'text-balance',
    'text-pretty',
    'text-ellipsis',
    'text-clip'
]);

const hasTextColorClass = (className: string) => {
    return className
        .trim()
        .split(/\s+/)
        .some((token) => {
            if (!token) return false;

            const withoutImportant = token.startsWith('!') ? token.slice(1) : token;
            const baseClass = withoutImportant.split(':').pop() ?? withoutImportant;

            if (!baseClass.startsWith('text-')) return false;
            if (NON_COLOR_TEXT_CLASSES.has(baseClass)) return false;
            if (baseClass.startsWith('text-opacity-')) return false;

            return true;
        });
};

export const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => { 
    const hasBgClass = className.includes('bg-');
    const hasColorTextClass = hasTextColorClass(className);

    return (
        <button
            {...props}
            className={`
            font-semibold 
            py-2.5 
            px-8 
            rounded-full
            transition-all 
            duration-300 
            ease-out
            active:scale-95
            focus:outline-none 
            focus-visible:ring-4 
            focus-visible:ring-app-focus/80
            focus-visible:ring-offset-2
            !cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${!hasBgClass ? 'bg-bluvi-purple' : ''}
            ${!hasColorTextClass ? 'text-white' : ''}
            shadow-md shadow-bluvi-purple/20
            border-b-2 border-black/10
            hover:-translate-y-0.5 
            hover:shadow-lg 

            ${className}
            `}
        >
            {children}
        </button>
    );
};

export default Button;
