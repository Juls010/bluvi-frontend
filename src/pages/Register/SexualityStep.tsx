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
    
    const [sexualityOptions, setSexualityOptions] = useState<{id: number, name: string}[]>([]);

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
            <div className="w-full max-w-md px-6 animate-fade-in">

            <RegisterStepHeader title="Tu sexualidad ..." className="mb-6" />

            <div className="w-full flex flex-col gap-3 mb-12">
                {sexualityOptions.map((option) => {
                        // Comparamos IDs numéricos
                        const isSelected = formData.sexuality === option.id;
                
                return (
                    <button
                    key={option.id}
                    onClick={() => updateFormData({ sexuality: option.id })}
                    className={`
                    w-full py-3.5 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
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

            <div className="w-full">
                <Button 
                aria-label="Siguiente paso" 
                className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!formData.sexuality ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNext}
                >
                Siguiente
                </Button>
            </div>

            </div>
        </AnimatedStep>
    );
};