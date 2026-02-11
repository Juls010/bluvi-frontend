import React from 'react';

export const BluAssistant: React.FC = () => {
    return (
        <div className="fixed bottom-20 right-6 flex flex-col items-end z-50 animate-fade-in-up">
        
        <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl rounded-br-none shadow-lg mb-3 max-w-xs">
            <p className="text-sm text-bluvi-purple font-medium">
            ¡Hola! Soy Blu. ¿Necesitas ayuda?
            </p>
            <button className="mt-2 text-xs bg-gray-200/50 px-3 py-1 rounded-full text-bluvi-purple/70 hover:bg-gray-200 transition-colors">
            Pues...
            </button>
        </div>

        <button className="w-14 h-14 bg-bluvi-purple text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>

        </div>
    );
};