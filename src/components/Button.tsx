import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => { 
    const hasBgClass = className.includes('bg-');
    const hasTextClass = className.includes('text-');

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
            focus:ring-4 
            focus:ring-bluvi-purple/20
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${!hasBgClass ? 'bg-bluvi-purple' : ''}
            ${!hasTextClass ? 'text-white' : ''}
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