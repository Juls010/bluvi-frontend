import React from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
// 1. IMPORTAMOS EL CONTEXTO
import { useRegister } from '../../context/RegisterContext';

export const AgeStep: React.FC = () => {
    const navigate = useNavigate();
    
    const { data, updateData } = useRegister();

    const handleNext = () => {
        const min_age = 16;

        if (data.birthDate) {
            const birthYear = new Date(data.birthDate).getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear < min_age) {
                alert(`Debes tener al menos ${min_age}`);
                return;
            }
        }

        navigate('/register/gender');
    };

    return (
        <div className="w-full max-w-md px-6 animate-fade-in">

            <div className="w-full text-left mb-8">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                    ¿Cuándo naciste?
                </h1>
                <p className="text-bluvi-purple/70 text-lg font-medium">
                    Esto nos ayuda a asegurar que Bluvi sea un espacio seguro para tu edad.
                </p>
            </div>

            <div className="w-full flex flex-col gap-6 mb-20">
                <InputField 
                    id="birthdate"
                    label="Fecha de Nacimiento" 
                    placeholder="" 
                    type="date"
                    value={data.birthDate}
                    onChange={(e) => updateData({ birthDate: e.target.value })} 
                />

                <p className="text-sm text-bluvi-purple/60 italic font-medium">
                    * Tu fecha de nacimiento no será pública en tu perfil.
                </p>
            </div>

            <div className="w-full">
                <Button 
                    ariaLabel="Ir al siguiente paso" 
                    className={`w-full py-3.5 text-lg shadow-md ${!data.birthDate ? 'opacity-50' : ''}`}
                    onClick={handleNext}
                >
                    Siguiente
                </Button>
            </div>

        </div>
    );
};