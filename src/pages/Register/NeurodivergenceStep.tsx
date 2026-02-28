import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { authService } from '../../services/auth.service';

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
            <div className="w-full max-w-3xl px-4 animate-fade-in flex flex-col items-center">
            
            <div className="w-full text-start mb-8">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-4">
                Te identificas con ...
                </h1>
            </div>

            <div className="w-full relative mb-16">
                <div className="flex justify-end mb-2">
                    <span className={`text-sm font-medium ${formData.neurodivergences.length === 4 ? 'text-red-400' : 'text-bluvi-purple/60'}`}>
                        Máximo 4 
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {availableTraits.map((trait) => {

                    const isSelected = formData.neurodivergences.includes(trait.id);
                    const isDisabled = !isSelected && formData.neurodivergences.length >= 4;
                    
                    console.log("Estado actual de Neurodivergencias (IDs):", formData.neurodivergences);

                    return (
                        <button
                            key={trait.id}
                            onClick={() => toggleTrait(trait.id)}
                            disabled={isDisabled}
                            className={`
                                py-2.5 px-5 rounded-xl text-base font-medium transition-all duration-300 border-2
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

            <div className="w-full max-w-md"> 
                <Button 
                    aria-label="Siguiente paso" 
                    className="w-full py-3.5 text-lg shadow-md"
                    onClick={handleNext}
                >
                    {formData.neurodivergences.length === 0 ? 'Omitir' : 'Siguiente'}
                </Button>
            </div>

            </div>
        </AnimatedStep>
    );
};