import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';

export const SexualityStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const options = [
        'Heterosexual', 
        'Homosexual', 
        'Bisexual', 
        'Asexual', 
        'Pansexual', 
        'Prefiero no decirlo'
    ];

    const handleNext = () => {
        if (!formData.sexuality) return;
        
        navigate('/register/neurodivergence'); 
    };

    return (
        <AnimatedStep>
            <div className="w-full max-w-md px-6 animate-fade-in">

            <div className="w-full text-left mb-6">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                Tu sexualidad ...
                </h1>
            </div>

            <div className="w-full flex flex-col gap-3 mb-12">
                {options.map((option) => {
                const isSelected = formData.sexuality === option;
                
                return (
                    <button
                    key={option}
                    onClick={() => updateFormData({ sexuality: option })}
                    className={`
                    w-full py-3.5 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
                    ${isSelected 
                        ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-[1.02]' 
                        
                        : 'bg-white/50 border-white/50 text-bluvi-purple hover:bg-white/80 hover:border-bluvi-purple/30'
                    }
                    `}
                >
                    {option}
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