import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

export const SexualityStep: React.FC = () => {

    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const [sexualityOptions, setSexualityOptions] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    setSexualityOptions(response.data.sexualities);
                }
            } catch (error) {
                console.error("Error cargando sexualidades:", error);
            }
        };
        fetchOptions();
    }, []);

    const handleNext = () => {
        if (!formData.sexuality) return;
        navigate('/register/neurodivergence');
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-10 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-6 md:[@media(max-height:1000px)]:pb-4">
                    
                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader 
                            title="Tu sexualidad ..." 
                            align="left"
                            compactOnShort
                            className="mb-0" 
                        />
                    </div>

                    <div 
                        className="flex-grow min-h-0 overflow-visible no-scrollbar py-6 md:py-32 md:[@media(max-height:1000px)]:py-6 px-5 flex flex-col items-center"
                        role="radiogroup" 
                        aria-label="Opciones de sexualidad"
                    >
                        <div className="flex flex-col gap-5 md:gap-10 md:[@media(max-height:1000px)]:gap-2 w-full max-w-sm">
                            {sexualityOptions.map((option) => {
                                const isSelected = formData.sexuality === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updateFormData({ sexuality: option.id })}
                                        className={`
                                            w-full py-3.5 md:[@media(max-height:1000px)]:py-2.5 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
                                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40
                                            ${isSelected
                                                ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-[1.02]'
                                                : 'bg-white/50 border-white/50 text-bluvi-purple hover:bg-white/80 hover:border-bluvi-purple/30'
                                            }
                                        `}
                                    >
                                        {option.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 md:pt-14 md:[@media(max-height:1000px)]:pt-2 shrink-0 w-full flex justify-center">
                        <Button
                            aria-label="Siguiente paso"
                            disabled={!formData.sexuality}
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 ${!formData.sexuality ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            onClick={handleNext}
                        >
                            Siguiente
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};
