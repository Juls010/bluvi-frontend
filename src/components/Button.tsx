import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    ariaLabel: string;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    onClick, 
    type = "button", 
    ariaLabel,
    className = "" 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`
            bg-bluvi-purple 
            text-white 
            font-semibold 
            py-2.5 
            px-8 
            rounded-full
            shadow-md shadow-bluvi-purple/20
            border-b-2 border-black/10
            transition-all 
            duration-300 
            ease-out
            hover:-translate-y-0.5 
            hover:shadow-lg 
            hover:shadow-bluvi-purple/30
            active:scale-95
            active:translate-y-0
            focus:outline-none 
            focus:ring-4 
            focus:ring-bluvi-purple/20

            ${className}
            `}
        >
            {children}
        </button>
    );
};