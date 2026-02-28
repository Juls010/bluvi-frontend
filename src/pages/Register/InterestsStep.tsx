import React, { useState, useEffect } from 'react'; 
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';
import { authService } from '../../services/auth.service';

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
            <div className="h-screen w-full flex flex-col items-center py-10 px-6 overflow-hidden fixed inset-0">
                <div className="max-w-2xl w-full flex flex-col h-full space-y-8 text-center animate-fade-in">
                    
                    <header className="space-y-2">
                        <h1 className="text-4xl font-bold text-bluvi-purple">Elige tus intereses</h1>
                        <p className="text-gray-600 font-medium">Selecciona al menos dos intereses</p>
                    </header>

                    <div className="flex-grow overflow-y-auto no-scrollbar py-4">
                        <div className="flex flex-wrap justify-center gap-3">
                            {interests.map((interest) => {
                                const isSelected = formData.interests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        type="button"
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`
                                            px-6 py-2.5 rounded-full border-2 font-medium transition-all duration-300
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

                    <div className="pt-6 pb-10">
                        <Button
                            onClick={handleNext}
                            disabled={formData.interests.length < MIN_SELECTION}
                            className={`w-full max-w-sm py-4 rounded-full text-lg shadow-xl
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