import React, { useState } from 'react';
import { type User } from '../data/mockUsers';
import { Button } from './Button'; 

interface IceBreakerModalProps {
    user: User;
    onSend: (message: string) => void;
    onCancel: () => void;
}

export const IceBreakerModal: React.FC<IceBreakerModalProps> = ({ user, onSend, onCancel }) => {
    const options = [
        "¡Hola! ¿Te apetece que charlemos?",
        `¡He visto que te gusta ${user.interests[0] || 'el arte'}! A mí también`,
        "Si pudieras viajar a cualquier sitio ahora, ¿cuál elegirías?"
    ];

    const [selectedMsg, setSelectedMsg] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bluvi-purple/20 backdrop-blur-md animate-fade-in">
        
        <div className="bg-white/95 w-full max-w-md rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden animate-scale-in">

            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center pt-8 px-8 pb-8">
                
                <div className="relative mb-4 group">
                    <div className="absolute inset-0 bg-bluvi-purple/20 rounded-full blur-md group-hover:bg-bluvi-purple/30 transition-all duration-500"></div>
                    <div className="w-24 h-24 relative z-10">
                        <img 
                            src={user.image} 
                            alt={user.name} 
                            className="w-full h-full rounded-full object-cover  shadow-sm"
                        />
                    </div>
                    <span className="absolute -right-2 top-0 text-2xl animate-bounce-slow" style={{ animationDuration: '3s' }}></span>
                </div>

                <h2 className="text-xl font-heading font-bold text-gray-800 mb-1 text-center">
                    ¡Es un match con {user.name.split(' ')[0]}!
                </h2>
                <p className="text-sm text-bluvi-purple/80 font-medium mb-6 text-center px-4 py-1.5 rounded-full">
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
                                        ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-[1.02]' 
                                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-bluvi-purple/30'
                                    }
                                `}
                            >
                                {msg}
                            </button>
                        );
                    })}
                </div>

            <div className="flex gap-4 w-full">
                
                <Button 
                    onClick={onCancel}
                    className="flex-1 !bg-white border-2 border-gray-200 !text-gray-500 hover:!border-gray-400 hover:!text-gray-700 hover:!bg-gray-50 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                    Ahora no
                </Button>

                <Button
                    disabled={!selectedMsg}
                    onClick={() => selectedMsg && onSend(selectedMsg)}
                    className={`flex-[2] border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95
                        ${selectedMsg 
                            ? 'bg-bluvi-purple border-bluvi-purple text-white hover:bg-opacity-90 shadow-md' 
                            : '!bg-gray-100 !border-gray-100 !text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    Enviar Mensaje
                </Button>
            </div>
            </div>
        </div>
        </div>
    );
};