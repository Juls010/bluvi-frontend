import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

export const CommunicationStyleStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    
    // 1. Estado para los estilos que vienen de la DB
    const [styles, setStyles] = useState<{id: number, name: string}[]>([]);

    // 2. Cargar los datos desde el servicio
    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    setStyles(response.data.communicationStyles);
                }
            } catch (error) {
                console.error("Error cargando estilos:", error);
            }
        };
        fetchStyles();
    }, []);

    const toggleStyle = (id: number) => {
        const currentList = formData.communicationStyle || [];
        
        // Ahora trabajamos con IDs numéricos
        if (currentList.includes(id)) {
            updateFormData({ 
                communicationStyle: currentList.filter(s => s !== id) 
            });
        } else {
            updateFormData({ 
                communicationStyle: [...currentList, id] 
            });
        }
    };

    const handleNext = () => {
        if (formData.communicationStyle.length === 0) return;
        navigate('/register/email');
    };

    const isValid = formData.communicationStyle.length >= 1;

    return (
        <AnimatedStep>
            <div className="w-full max-w-3xl px-4 animate-fade-in flex flex-col items-center">

            <RegisterStepHeader title="Tu estilo de comunicación" align="center" className="mb-8" />

            <div className="w-full relative mb-16">

                <div className="flex justify-end mb-2">
                    <span className={`text-sm font-medium ${!isValid ? 'text-red-400 font-bold' : 'text-green-600'}`}>
                        Mínimo 1
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {styles.map((style) => {
                            // Comparamos con style.id
                            const isSelected = formData.communicationStyle.includes(style.id);
                    
                    return (
                        <button
                        key={style.id}
                        onClick={() => toggleStyle(style.id)}
                        className={`
                            py-2.5 px-5 rounded-xl text-base font-medium transition-all duration-300 border-2
                            ${isSelected 
                            ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-105' 

                            : 'bg-white/50 border-bluvi-purple/30 text-bluvi-purple hover:border-bluvi-purple/60'
                            }
                        `}
                        >
                        {style.name}
                        </button>
                    );
                    })}
                </div>
            </div>

            <div className="w-full max-w-md">
                <Button 
                aria-label="Siguiente paso" 
                className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNext}
                >
                Siguiente
                </Button>
            </div>

            </div>
        </AnimatedStep>
    );
};