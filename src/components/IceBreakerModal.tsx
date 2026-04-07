import React, { useState } from 'react';
import type { User } from '../types/User.types';
import { Button } from './Button'; 

interface IceBreakerModalProps {
    user: User;
    onSend: (message: string) => void;
    onCancel: () => void;
}

export const IceBreakerModal: React.FC<IceBreakerModalProps> = ({ user, onSend, onCancel }) => {
    const featuredInterest = Array.isArray(user.interests) && user.interests.length > 0
        ? user.interests[0]
        : 'el arte';

    const mainPhoto = Array.isArray(user.photos) && user.photos.length > 0 && user.photos[0]
        ? user.photos[0]
        : 'https://via.placeholder.com/150';

    const options = [
        "¡Hola! ¿Te apetece que charlemos?",
        `¡He visto que te gusta ${featuredInterest}! A mí también`,
        "Si pudieras viajar a cualquier sitio ahora, ¿cuál elegirías?"
    ];

    const [selectedMsg, setSelectedMsg] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/35 dark:bg-black/55 backdrop-blur-md animate-fade-in">
        
        <div className="bg-app-surface-strong text-app-primary w-full max-w-md rounded-[2rem] shadow-2xl border border-app-soft relative overflow-hidden animate-scale-in">

            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full blur-3xl opacity-45 pointer-events-none" style={{ backgroundColor: 'var(--app-accent)' }} />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--app-accent-strong)' }} />

            <div className="relative z-10 flex flex-col items-center pt-8 px-8 pb-8">
                
                <div className="relative mb-4 group">
                    <div className="absolute inset-0 rounded-full blur-md transition-all duration-500 opacity-55 group-hover:opacity-75" style={{ backgroundColor: 'var(--app-accent)' }} />
                    <div className="w-24 h-24 relative z-10">
                        <img 
                            src={mainPhoto}
                            alt={user.first_name} 
                            className="w-full h-full rounded-full object-cover  shadow-sm"
                        />
                    </div>
                    <span className="absolute -right-2 top-0 text-2xl animate-bounce-slow" style={{ animationDuration: '3s' }}></span>
                </div>

                <h2 className="text-xl font-heading font-bold text-app-primary mb-1 text-center">
                    ¡Es un match con {user.first_name}!
                </h2>
                <p className="text-sm text-app-accent font-medium mb-6 text-center px-4 py-1.5 rounded-full bg-app-surface border border-app-soft">
                    Elige cómo quieres romper el hielo
                </p>

                <div className="w-full space-y-3 mb-8">
                    {options.map((msg, idx) => {
                        const isSelected = selectedMsg === msg;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedMsg(msg)}
                                className={`
                                    w-full py-4 px-6 rounded-2xl text-sm font-medium transition-all duration-300 border-2 text-left
                                    ${isSelected 
                                        ? 'text-white font-bold shadow-md scale-[1.02] border-transparent' 
                                        : 'bg-app-surface border-app-soft text-app-secondary hover:bg-app-surface-soft hover:border-bluvi-purple/30'
                                    }
                                `}
                                style={isSelected ? { backgroundColor: 'var(--app-accent)' } : undefined}
                            >
                                {msg}
                            </button>
                        );
                    })}
                </div>

            <div className="flex gap-4 w-full">
                
                <Button 
                    onClick={onCancel}
                    className="flex-1 !bg-app-surface border-2 !border-app-soft !text-app-secondary hover:!border-bluvi-purple/40 hover:!text-app-primary hover:!bg-app-surface-soft shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                    Ahora no
                </Button>

                <Button
                    disabled={!selectedMsg}
                    onClick={() => selectedMsg && onSend(selectedMsg)}
                    className={`flex-[2] border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95
                        ${selectedMsg 
                            ? 'text-white shadow-md border-transparent hover:brightness-105' 
                            : '!bg-app-surface-soft !border-app-soft !text-app-muted cursor-not-allowed'
                        }
                    `}
                    style={selectedMsg ? { backgroundColor: 'var(--app-accent)' } : undefined}
                >
                    Enviar Mensaje
                </Button>
            </div>
            </div>
        </div>
        </div>
    );
};