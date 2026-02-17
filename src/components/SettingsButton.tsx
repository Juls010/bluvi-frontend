import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
    onClick?: () => void;
}

    export const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
    return (
        <button 
            onClick={onClick}
            aria-label="Ajustes de accesibilidad"
            className="
                text-bluvi-purple/80 
                bg-white/30 
                hover:bg-white/60 
                p-2.5 
                rounded-full 
                backdrop-blur-sm
                transition-all 
                duration-300
                hover:rotate-45
                active:scale-90
                focus:outline-none 
                focus:ring-4 
                focus:ring-bluvi-light-purple/50
                cursor-pointer
            "
        >
            <Settings 
                size={28} // Equivalente a w-7 h-7 (28px)
                strokeWidth={2} // El grosor que tenías definido
                className="transition-all"
            />
        </button>
    );
};