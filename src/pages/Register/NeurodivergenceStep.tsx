import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

export const NeurodivergenceStep: React.FC = () => {
    const navigate = useNavigate();
    const { data, updateData } = useRegister();

    const traits = [
    // Neurodesarrollo y Aprendizaje
    'ADHD', 
    'Autismo', 
    'Dislexia', 
    'Discalculia',   
    'Dispraxia',     
    'Síndrome Tourette',
    
    // Salud Mental y Emocional
    'Ansiedad',      
    'Ansiedad Social', 
    'Depresión', 
    'Bipolar', 
    'TOC',           
    'TLP',          
    
    // Rasgos y Sensorialidad
    'PAS (Alta Sensibilidad)', 
    'ARFID', 
    
    // Discapacidad y Genética
    'Síndrome Down', 
    'Discapacidad intelectual',
    'Parálisis cerebral', 
    'Tartamudez'
];

    const toggleTrait = (trait: string) => {
        const currentList = data.neurodivergences;
        const max_feature = 4;

        if (currentList.includes(trait)) {
        updateData({ 
            neurodivergences: currentList.filter(t => t !== trait) 
        });
        } else {
        if (currentList.length < max_feature) {
            updateData({ 
            neurodivergences: [...currentList, trait] 
            });
        }
        }
    };

    const handleNext = () => {
        navigate('/register/communication');
    };

    return (
        <div className="w-full max-w-3xl px-4 animate-fade-in flex flex-col items-center">
        
        <div className="w-full text-start mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-4">
            Te identificas con ...
            </h1>
        </div>

        <div className="w-full relative mb-16">
            <div className="flex justify-end mb-2">
                <span className={`text-sm font-medium ${data.neurodivergences.length === 4 ? 'text-red-400' : 'text-bluvi-purple/60'}`}>
                    Máximo 4 
                </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {traits.map((trait) => {
                const isSelected = data.neurodivergences.includes(trait);
                const isDisabled = !isSelected && data.neurodivergences.length >= 4;
                
                return (
                    <button
                        key={trait}
                        onClick={() => toggleTrait(trait)}
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
                        {trait}
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
                {data.neurodivergences.length === 0 ? 'Omitir' : 'Siguiente'}
            </Button>
        </div>

        </div>
    );
};