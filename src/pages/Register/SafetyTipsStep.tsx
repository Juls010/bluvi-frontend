import { HeartIcon, ShieldCheckIcon, UserCheckIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { Button } from '../../components/Button';
import { NarrationButton } from '../../components/NarrationButton';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

const TIPS = [
    {
        icon: <ShieldCheckIcon size={24} weight="bold" aria-hidden="true" />,
        title: 'Ir despacio está bien.',
        text: 'No tienes que compartir tu número ni datos personales al principio. Puedes conocer a alguien poco a poco.',
    },
    {
        icon: <UserCheckIcon size={24} weight="bold" aria-hidden="true" />,
        title: 'Tu comodidad importa.',
        text: 'Si una conversación te incomoda, te presiona o no te da buena sensación, puedes parar y avisarnos.',
    },
    {
        icon: <HeartIcon size={24} weight="bold" aria-hidden="true" />,
        title: 'Queremos trato amable.',
        text: 'Detrás de cada perfil hay una persona. Hablar con respeto ayuda a que Bluvi sea un lugar más cómodo.',
    },
    {
        icon: <WarningCircleIcon size={24} weight="bold" aria-hidden="true" />,
        title: 'Pedir ayuda es lo correcto',
        text: 'No envíes dinero a nadie. Si ves algo extraño, bloquear o reportar nos ayuda a proteger la comunidad.',
    },
];

const SAFETY_TIPS_NARRATION = [
    'Antes de entrar en Bluvi, te dejamos unos consejos sencillos.',
    'No son normas para agobiarte. Son pequeñas ideas para que puedas moverte con calma y sentirte con seguridad.',
    ...TIPS.flatMap((tip) => [tip.title, tip.text]),
    'Cuando te apetezca seguir, pulsa Entendido, vamos allá.',
].join(' ');

export const SafetyTipsStep = () => {
    const navigate = useNavigate();

    const handleFinishRegistration = () => {
        navigate('/app/home');
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-4xl w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">
                    <div className="shrink-0 flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <RegisterStepHeader
                            title="Un momento..."
                            subtitle="Queremos que Bluvi se sienta como un espacio tranquilo, claro y respetuoso para ti."
                            align="left"
                            compactOnShort
                            className="mb-0 flex-1"
                        />
                        <NarrationButton
                            text={SAFETY_TIPS_NARRATION}
                            className="shrink-0 sm:pt-1"
                        />
                    </div>

                    <div
                        className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 md:[@media(max-height:1000px)]:gap-2 items-stretch"
                        role="list"
                        aria-label="Lista de consejos de seguridad"
                    >
                        {TIPS.map((tip, index) => (
                            <section
                                key={index}
                                role="listitem"
                                className="flex h-full min-h-[132px] w-full items-start text-left gap-3 md:gap-4 md:[@media(max-height:1000px)]:gap-2 p-4 md:p-6 md:[@media(max-height:1000px)]:py-3 rounded-[2rem] bg-white/30 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow"
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
                            className="w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 bg-bluvi-purple text-white transition-all hover:scale-102 active:scale-98"
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
