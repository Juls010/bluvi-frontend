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
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-2xl w-full h-full min-h-0 flex flex-col justify-between py-4 md:py-8">

                    <div className="shrink-0">
                        <RegisterStepHeader 
                            title="Tu estilo de comunicación" 
                            align="left" 
                            compactOnShort
                            className="mb-0" 
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-2 px-1">
                        <div className="flex justify-end mb-4">
                            <span className={`text-sm font-medium ${!isValid ? 'text-red-400 font-bold' : 'text-green-600/70'}`}>
                                Mínimo 1
                            </span>
                        </div>

                        <div 
                            className="grid grid-cols-2 grid-flow-dense md:flex md:flex-wrap justify-center gap-3"
                            role="group"
                            aria-label="Estilos de comunicación"
                        >
                            {styles.map((style) => {
                                const isSelected = formData.communicationStyle.includes(style.id);
                                const isLongName = style.name.length > 18;
                        
                                return (
                                    <button
                                        key={style.id}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        onClick={() => toggleStyle(style.id)}
                                        className={`
                                            py-3 px-4 md:px-5 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 border-2
                                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40
                                            ${isLongName ? 'col-span-2' : 'col-span-1'}
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

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            aria-label="Siguiente paso" 
                            disabled={!isValid}
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
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