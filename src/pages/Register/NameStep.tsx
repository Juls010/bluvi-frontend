import React from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';


export const NameStep: React.FC = () => {
    const navigate = useNavigate();
    
    const { formData, updateFormData } = useRegister();
    
    const isValid = formData.firstName?.trim().length > 0;

    const handleNext = () => {
        if (!isValid) return;

        navigate('/register/age');
    };

    return (
        <AnimatedStep>
            <div className="w-full max-w-md px-6 animate-fade-in">

                <div className="w-full text-left mb-8"> 
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                        ¿Cómo te llamas?
                    </h1>
                    <p className="text-bluvi-purple/70 text-lg font-medium">
                        ¡Nos emociona conocerte!
                    </p>
                </div>

                <div className="w-full flex flex-col gap-6 mb-20">
                    <InputField 
                        id="nombre" label="Nombre" 
                        value={formData.firstName} 
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                        placeholder='Aurora'
                    />
                    
                    <InputField 
                        id="apellidos" label="Apellidos" 
                        value={formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                        placeholder='Montenegro'
                    />
                </div>

                <div className="w-full">
                    <Button 
                        onClick={handleNext} 
                        aria-label="Siguiente" 
                        className={`w-full py-3.5 shadow-md transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Siguiente
                    </Button>
                </div>

            </div>
        </AnimatedStep>
    );
};