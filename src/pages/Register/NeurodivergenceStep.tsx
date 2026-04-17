import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

export const NeurodivergenceStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    const [availableTraits, setAvailableTraits] = useState<{id: number, name: string}[]>([]);
    const MAX_NEURO_TRAITS = 4;

    useEffect(() => {
        const fetchTraits = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    setAvailableTraits(response.data.neurodivergences);
                }
            } catch (error) {
                console.error("Error cargando rasgos:", error);
            }
        };
        fetchTraits();
    }, []);

    const toggleTrait = (traitId: number) => {
        const currentList = formData.neurodivergences || []; 
        const isSelected = currentList.includes(traitId);

        if (isSelected) {
            updateFormData({ 
                neurodivergences: currentList.filter(id => id !== traitId) 
            });
        } else if (currentList.length < MAX_NEURO_TRAITS) {
            updateFormData({ 
                neurodivergences: [...currentList, traitId] 
            });
        }
    };

    const handleNext = () => {
        navigate('/register/communication');
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-2xl w-full h-full min-h-0 flex flex-col justify-between pt-10 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">

                    <div className="shrink-0">
                        <RegisterStepHeader 
                            title="Te identificas con ..." 
                            compactOnShort
                            className="mb-0" 
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-4 md:py-32 md:[@media(max-height:1000px)]:py-14 px-1">
                        <div className="flex justify-end mb-8 w-full max-w-2xl">
                            <span className={`text-sm font-medium ${formData.neurodivergences.length === 4 ? 'text-red-400' : 'text-bluvi-purple/60'}`}>
                                Máximo 4 
                            </span>
                        </div>

                        <div 
                            className="grid grid-cols-2 grid-flow-dense md:flex md:flex-wrap justify-center gap-3 md:gap-5 md:[@media(max-height:1000px)]:gap-2"
                            role="group"
                            aria-label="Opciones de neurodivergencia"
                        >
                            {availableTraits.map((trait) => {
                                const isSelected = formData.neurodivergences.includes(trait.id);
                                const isDisabled = !isSelected && formData.neurodivergences.length >= 4;
                                const isLongName = trait.name.length > 18;

                                return (
                                    <button
                                        key={trait.id}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        onClick={() => toggleTrait(trait.id)}
                                        disabled={isDisabled}
                                        className={`
                                            py-2.5 md:[@media(max-height:1000px)]:py-2 px-4 md:px-5 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 border-2
                                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40
                                            ${isLongName ? 'col-span-2' : 'col-span-1'}
                                            ${isSelected 
                                                ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-105' 
                                                : 'bg-white/50 border-bluvi-purple/30 text-bluvi-purple hover:border-bluvi-purple/60'
                                            }
                                            ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                        `}
                                    >
                                        {trait.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 md:pt-12 shrink-0 w-full flex justify-center"> 
                        <Button 
                            aria-label="Siguiente paso" 
                            className="w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 hover:scale-102 active:scale-98"
                            onClick={handleNext}
                        >
                            {formData.neurodivergences.length === 0 ? 'Omitir' : 'Siguiente'}
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};
