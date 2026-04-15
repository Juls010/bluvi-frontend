import { ShieldCheck, Heart, UserCheck, MessageCircleWarning } from 'lucide-react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { AnimatedStep } from '../../components/AnimatedStep';

const TIPS = [
    {
        icon: <ShieldCheck size={24} aria-hidden="true" />,
        title: "Tómate tu tiempo",
        text: "No compartas tu número personal de inmediato. Ve a tu ritmo."
    },
    {
        icon: <UserCheck size={24} aria-hidden="true" />,
        title: "Confía en tu instinto",
        text: "Si algo te incomoda o te parece raro, avísanos en cualquier momento."
    },
    {
        icon: <Heart size={24} aria-hidden="true" />,
        title: "Comunidad amable",
        text: "Trata a los demás con respeto. Lo mejor de Bluvi es la gente auténtica."
    },
    {
        icon: <MessageCircleWarning size={24} aria-hidden="true" />,
        title: "Reportar es cuidarnos",
        text: "Nunca envíes dinero y denuncia comportamientos que no sigan las normas."
    }
];

export const SafetyTipsStep = () => {
    const navigate = useNavigate();

    const handleFinishRegistration = () => {
        navigate('/app/home'); 
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-4xl w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">

                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="Consejos para disfrutar"
                            subtitle="Queremos que tu experiencia en Bluvi sea siempre segura y agradable."
                            align="left"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div 
                        className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 md:[@media(max-height:1000px)]:gap-2 place-items-center"
                        role="list"
                        aria-label="Lista de consejos de seguridad"
                    >
                        {TIPS.map((tip, index) => (
                            <section 
                                key={index}
                                role="listitem"
                                className="flex items-start text-left gap-3 md:gap-4 md:[@media(max-height:1000px)]:gap-2 p-4 md:p-6 md:[@media(max-height:1000px)]:py-3 rounded-[2rem] bg-white/30 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow h-fit"
                            >
                                <div className="p-3 bg-white/50 rounded-2xl shadow-inner shrink-0 text-bluvi-purple">
                                    {tip.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-bluvi-purple text-sm md:text-base leading-tight">{tip.title}</h3>
                                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{tip.text}</p>
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button
                            onClick={handleFinishRegistration} 
                            className="w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 bg-bluvi-purple text-white transition-all hover:scale-105 active:scale-95"
                            aria-label="Entendido, finalizar registro"
                        >
                            ¡Entendido, vamos allá!
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};
