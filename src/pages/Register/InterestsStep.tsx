import { useState, useEffect } from 'react'; 
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

interface Interest {
    id: number;
    name: string;
}

export const InterestsStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    
    const [interests, setInterests] = useState<Interest[]>([]); 
    const MIN_SELECTION = 2;

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    setInterests(response.data.interests);
                }
            } catch (err) {
                console.error("Error cargando intereses desde el servicio:", err);
            }
        };

        fetchInterests();
    }, []);

    const handleNext = () => {
        if (formData.interests.length >= MIN_SELECTION) {
            navigate('/register/description');
        }
    };

    const toggleInterest = (id: number) => {
        const currentInterests = formData.interests || [];
        const newSelection = currentInterests.includes(id)
            ? currentInterests.filter(i => i !== id)
            : [...currentInterests, id];

        updateFormData({ interests: newSelection });
    };

    return (
        <AnimatedStep>
            <div className="w-full flex flex-col items-center px-4 md:px-6 animate-fade-in">
                <div className="max-w-2xl w-full flex flex-col min-h-0 space-y-5 md:space-y-6 text-center">

                    <RegisterStepHeader
                        title="Elige tus intereses"
                        subtitle="Selecciona al menos dos intereses"
                        align="center"
                        className="mb-0"
                    />

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-2 md:py-4">
                        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
                            {interests.map((interest) => {
                                const isSelected = formData.interests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        type="button"
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`
                                            px-5 md:px-6 py-2 md:py-2.5 rounded-full border-2 text-sm md:text-base font-medium transition-all duration-300
                                            ${isSelected 
                                                ? 'bg-bluvi-purple border-bluvi-purple text-white shadow-lg scale-105' 
                                                : 'bg-white/40 border-white/60 text-bluvi-purple hover:bg-white/60'}
                                        `}
                                    >
                                        {interest.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-2 md:pt-4 pb-4 md:pb-6">
                        <Button
                            onClick={handleNext}
                            disabled={formData.interests.length < MIN_SELECTION}
                            className={`w-full max-w-sm py-3.5 md:py-4 rounded-full text-base md:text-lg shadow-xl
                            ${formData.interests.length >= MIN_SELECTION ? 'bg-bluvi-purple text-white' : 'bg-gray-200 text-gray-400 opacity-50'}`}
                        >
                            Siguiente {formData.interests.length > 0 && `${formData.interests.length}/5`}
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep> 
    );
};