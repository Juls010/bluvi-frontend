import React, { useState } from 'react';
import { ShieldCheck, Heart, UserCheck, MessageCircleWarning, Info } from 'lucide-react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { SuccessModal } from '../../components/SuccessModal';

const TIPS = [
    {
        icon: <ShieldCheck className="text-bluvi-purple" size={24} />,
        title: "Tómate tu tiempo",
        text: "No compartas tu número personal ni tu dirección de inmediato. Ve a tu ritmo, aquí no hay prisa."
    },
    {
        icon: <Heart className="text-bluvi-purple" size={24} />,
        title: "Comparte tus planes",
        text: "Cuéntale a una persona de confianza tus planes. Compartir la emoción es parte de la aventura."
    },
    {
        icon: <UserCheck className="text-bluvi-purple" size={24} />,
        title: "Confía en tu instinto",
        text: "Si algo te incomoda o te parece raro, avísanos. En Bluvi estamos para ayudarte en todo momento."
    },
    {
        icon: <MessageCircleWarning className="text-bluvi-purple" size={24} />,
        title: "Seguridad financiera",
        text: "Nunca envíes dinero ni compartas datos bancarios o documentos sensibles con nadie."
    }
];

export const SafetyTipsStep = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

        const handleFinishRegistration = () => {
            setIsModalOpen(true); 
        };

        const handleCloseAndGoToLanding = () => {
            setIsModalOpen(false);
            navigate('/landing'); // Te lleva a la landing
        };

    return (
        <div className="h-[100dvh] w-full flex flex-col items-center justify-center px-6 overflow-hidden fixed inset-0 animate-fade-in">
            <div className="max-w-2xl w-full flex flex-col h-full py-12 space-y-8">

                <header className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-bluvi-purple">
                        Consejos para disfrutar con tranquilidad
                    </h1>
                    <p className="text-gray-600 font-medium max-w-lg mx-auto">
                        Queremos que tu experiencia en Bluvi sea siempre segura y agradable. Ten en cuenta estas cositas:
                    </p>
                </header>

                <div className="flex-grow overflow-y-auto no-scrollbar py-4 space-y-6">
                    {TIPS.map((tip, index) => (
                        <section 
                            key={index}
                            className="flex items-start gap-4 p-5 rounded-3xl bg-white/30 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 bg-white/50 rounded-2xl shadow-inner shrink-0">
                                {tip.icon}
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-bold text-bluvi-purple text-lg">{tip.title}</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">{tip.text}</p>
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="pt-6 space-y-6 text-center">
                <div className="flex items-center justify-center gap-2 text-bluvi-purple/70 font-medium italic">
                    <Info size={16} />
                    <span>Lo mejor de Bluvi es la gente auténtica como tú.</span>
                </div>
                
                <Button
                    onClick={handleFinishRegistration} 
                    className="w-full max-w-sm py-4 rounded-full text-lg shadow-xl bg-bluvi-purple text-white hover:scale-105"
                    aria-label="Entendido, finalizar registro"
                >
                    ¡Entendido, vamos allá!
                </Button>
            </footer>

            <SuccessModal 
                isOpen={isModalOpen} 
                onClose={handleCloseAndGoToLanding} 
            />
            </div>
        </div>
    );
};