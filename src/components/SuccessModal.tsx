import React from 'react';
import { Mail, ArrowRight, PartyPopper } from 'lucide-react';
import { Button } from './Button';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bluvi-purple/20 backdrop-blur-md animate-fade-in">
            
            <div 
                role="alertdialog" 
                aria-labelledby="modal-title" 
                aria-describedby="modal-desc"
                className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center space-y-6 animate-scale-up"
            >
                <div className="mx-auto w-20 h-20 bg-bluvi-purple/10 rounded-full flex items-center justify-center text-bluvi-purple">
                    <PartyPopper size={40} />
                </div>

                <div className="space-y-2">
                    <h2 id="modal-title" className="text-3xl font-bold text-bluvi-purple">
                        ¡Casi listo!
                    </h2>
                    <p id="modal-desc" className="text-gray-600 font-medium leading-relaxed">
                        Te hemos enviado un enlace de verificación a tu correo. Por seguridad, **confirma tu email** antes de entrar en la comunidad.
                    </p>
                </div>

                <div className="bg-white/40 rounded-2xl p-4 flex items-center justify-around border border-white/60">
                    <div className="flex flex-col items-center gap-1">
                        <Mail size={20} className="text-bluvi-purple" />
                        <span className="text-[10px] uppercase font-bold text-gray-400">Verifica</span>
                    </div>
                    <ArrowRight size={16} className="text-gray-300" />
                    <div className="flex flex-col items-center gap-1 opacity-50">
                        <PartyPopper size={20} className="text-bluvi-purple" />
                        <span className="text-[10px] uppercase font-bold text-gray-400">¡Bluvi!</span>
                    </div>
                </div>

                <Button 
                    onClick={onClose}
                    className="w-full bg-bluvi-purple text-white py-4 rounded-full text-lg shadow-lg"
                >
                    Ir al inicio de sesión
                </Button>
            </div>
        </div>
    );
};