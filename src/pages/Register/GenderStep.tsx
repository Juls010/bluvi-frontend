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
            <div className="w-full max-w-md px-6 animate-fade-in">

            <RegisterStepHeader
                title="¿Con qué género te identificas?"
                subtitle="Queremos conocerte mejor"
                className="mb-8"
            />

            <div className="w-full flex flex-col gap-4 mb-20">
                {genderOptions.map((option) => {
                // 2. Comparación de seguridad: 
                // Verificamos que option.id exista y que formData.gender no esté vacío
                const isSelected = formData.gender !== '' && 
                                formData.gender !== undefined && 
                                formData.gender === option.id;

                return (
                    <button
                    key={option.id}
                    onClick={() => updateFormData({ gender: option.id })} 
                    className={`
                        w-full py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
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
                className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!formData.gender ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNext}
                >
                Siguiente
                </Button>
            </div>

            </div>
        </AnimatedStep>
    );
};