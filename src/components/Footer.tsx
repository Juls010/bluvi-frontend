import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full flex justify-between items-center px-10 py-8 text-[15px] text-bluvi-purple/50 font-medium">
        <button className="hover:text-bluvi-purple transition-colors">
            Política de privacidad
        </button>
        
        <span>2025 ©</span>
        
        <button className="hover:text-bluvi-purple transition-colors">
            Términos y condiciones
        </button>
        </footer>
    );
};