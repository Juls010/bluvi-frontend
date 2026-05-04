import React, { useState } from 'react';
import type { User } from '../types/User.types';
import { Button } from './Button'; 
import { AlertTriangle } from 'lucide-react';
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';

interface ReportUserModalProps {
    user: User;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({ user, onConfirm, onCancel }) => {
    const mainPhoto = Array.isArray(user.photos) && user.photos.length > 0 && user.photos[0]
        ? user.photos[0]
        : 'https://via.placeholder.com/150';

    const options = [
        "Comportamiento inapropiado",
        "Perfil falso / Spam",
        "Fotos inapropiadas",
        "Acoso o agresividad"
    ];

    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    return (
        <ModalOverlay 
            isOpen={true} 
            onOpenChange={onCancel}
            isDismissable={true}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/35 dark:bg-black/55 backdrop-blur-md animate-fade-in"
        >
        <Modal className="w-full max-w-md outline-none">
        <Dialog 
            role="alertdialog" 
            aria-labelledby="report-modal-title" 
            aria-describedby="report-modal-desc"
            className="bg-app-surface-strong text-app-primary w-full rounded-[2rem] shadow-2xl border border-app-soft relative overflow-hidden animate-scale-in outline-none"
        >

            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none bg-red-500" />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none bg-red-600" />

            <div className="relative z-10 flex flex-col items-center pt-8 px-8 pb-8">
                
                <div className="relative mb-4 group">
                    <div className="absolute inset-0 rounded-full blur-md transition-all duration-500 opacity-55 group-hover:opacity-75 bg-red-500" />
                    <div className="w-20 h-20 relative z-10">
                        <img 
                            src={mainPhoto}
                            alt={user.first_name} 
                            className="w-full h-full rounded-full object-cover shadow-sm border-2 border-red-500/50"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-md">
                        <AlertTriangle size={18} className="text-white" />
                    </div>
                </div>

                <Heading id="report-modal-title" className="text-xl font-heading font-bold text-app-primary mb-1 text-center">
                    Denunciar a {user.first_name}
                </Heading>
                <p id="report-modal-desc" className="text-sm text-app-secondary mb-6 text-center">
                    ¿Por qué quieres reportar este perfil?
                </p>

                <div className="w-full space-y-3 mb-6" role="radiogroup" aria-label="Motivo de denuncia">
                    {options.map((reason, idx) => {
                        const isSelected = selectedReason === reason;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedReason(reason)}
                                className={`
                                    w-full py-3.5 px-6 rounded-xl text-sm font-medium transition-all duration-300 border-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                                    ${isSelected 
                                        ? 'text-white font-bold shadow-md scale-[1.02] border-transparent bg-red-500' 
                                        : 'bg-app-surface border-app-soft text-app-secondary hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-300 hover:text-red-600'
                                    }
                                `}
                                role="radio"
                                aria-checked={isSelected}
                            >
                                {reason}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3 mb-8 w-full">
                    <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium leading-relaxed">
                        Al confirmar, dejaréis de veros mutuamente en la aplicación de forma inmediata (Bloqueo automático).
                    </p>
                </div>

                <div className="flex gap-4 w-full">
                    <Button 
                        onClick={onCancel}
                        className="flex-1 !bg-app-surface border-2 !border-app-soft !text-app-secondary hover:!border-red-300 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-500/10 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                        Cancelar
                    </Button>

                    <Button
                        disabled={!selectedReason}
                        onClick={() => selectedReason && onConfirm(selectedReason)}
                        className={`flex-[1.5] border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95
                            ${selectedReason 
                                ? 'text-white shadow-md border-transparent hover:brightness-105 bg-red-600' 
                                : '!bg-app-surface-soft !border-app-soft !text-app-muted cursor-not-allowed'
                            }
                        `}
                    >
                        Enviar y Bloquear
                    </Button>
                </div>
            </div>
        </Dialog>
        </Modal>
        </ModalOverlay>
    );
};
