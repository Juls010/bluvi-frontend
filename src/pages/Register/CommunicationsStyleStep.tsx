import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

export const CommunicationStyleStep: React.FC = () => {
    const navigate = useNavigate();
    const { data, updateData } = useRegister();

    const styles = [
    'Mensajes de texto', 
    'Notas de voz',        
    'Videollamadas', 
    'Llamadas de voz',
    'Memes', 
    'Directa y literal', 
    'Conversación casual', 
    'Conversación profunda', 
    'Lento y reflexivo', 
    'Pocas palabras', 
    'Párrafos largos',
    'Infodumping',          
    'Ecolalia', 
    'Compañía silenciosa'  
    ];

    const toggleStyle = (style: string) => {
        const currentList = data.communicationStyle;
        
        if (currentList.includes(style)) {
        updateData({ 
            communicationStyle: currentList.filter(s => s !== style) 
        });
        } else {
        updateData({ 
            communicationStyle: [...currentList, style] 
        });
        }
    };

    const handleNext = () => {

        if (data.communicationStyle.length === 0) return;
        
        navigate('/register/email');
    };

    const isValid = data.communicationStyle.length >= 1;

    return (
        <div className="w-full max-w-3xl px-4 animate-fade-in flex flex-col items-center">

        <div className="w-full text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-4">
            Tu estilo de comunicación
            </h1>
        </div>

        <div className="w-full relative mb-16">

            <div className="flex justify-end mb-2">
                <span className={`text-sm font-medium ${!isValid ? 'text-red-400 font-bold' : 'text-green-600'}`}>
                    Mínimo 1
                </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {styles.map((style) => {
                const isSelected = data.communicationStyle.includes(style);
                
                return (
                    <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`
                        py-2.5 px-5 rounded-xl text-base font-medium transition-all duration-300 border-2
                        ${isSelected 
                        ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-105' 

                        : 'bg-white/50 border-bluvi-purple/30 text-bluvi-purple hover:border-bluvi-purple/60'
                        }
                    `}
                    >
                    {style}
                    </button>
                );
                })}
            </div>
        </div>

        <div className="w-full max-w-md">
            <Button 
            ariaLabel="Siguiente paso" 
            className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            >
            Siguiente
            </Button>
        </div>

        </div>
    );
};