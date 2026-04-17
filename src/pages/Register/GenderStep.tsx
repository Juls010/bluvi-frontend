import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';


interface GenderOption {
    id: number;
    name: string;
}

export const GenderStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const [genderOptions, setGenderOptions] = useState<GenderOption[]>([]);

    useEffect(() => {
        const fetchGenders = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    // DEBUG: Mira qué llega exactamente del Back
                    console.log("Datos recibidos de géneros:", response.data.genders);
                    setGenderOptions(response.data.genders);
                }
            } catch (error) {
                console.error("Error cargando géneros:", error);
            }
        };
        fetchGenders();
    }, []);

    const handleNext = () => {
        if (!formData.gender) return;
        navigate('/register/sexuality');
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">

                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="¿Con qué género te identificas?"
                            subtitle="Queremos conocerte mejor"
                            align="left"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div
                        className="flex-grow min-h-0 overflow-visible no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center"
                        role="radiogroup"
                        aria-label="Opciones de género"
                    >
                        <div className="flex flex-col gap-6 md:gap-10 md:[@media(max-height:1000px)]:gap-4 w-full max-w-sm">
                            {genderOptions.map((option) => {
                                const isSelected = formData.gender !== '' &&
                                    formData.gender !== undefined &&
                                    formData.gender === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updateFormData({ gender: option.id })}
                                        className={`
                                            w-full py-4 md:[@media(max-height:1000px)]:py-3 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
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

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button
                            aria-label="Siguiente paso"
                            disabled={!formData.gender}
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 ${!formData.gender ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98'}`}
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
