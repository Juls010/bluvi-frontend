import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { Button } from '../../components/Button';
import { DatePicker } from '../../components/DatePicker'; 
import { useRegister } from '../../context/RegisterContext';
import { parseDate, CalendarDate } from '@internationalized/date';

export const AgeStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    let calendarValue: CalendarDate | null = null;
    try {
        if (formData.birthDate) {
            calendarValue = parseDate(formData.birthDate);
        }
    } catch (e) {
        console.error("Error parseando la fecha:", e);
    }

    const handleNext = () => {
        const min_age = 16;

        if (formData.birthDate) {
            const birthDateObj = new Date(formData.birthDate);
            const birthYear = birthDateObj.getFullYear();
            const currentYear = new Date().getFullYear();

            if (currentYear - birthYear < min_age) {
                alert(`Debes tener al menos ${min_age} años para unirte a Bluvi.`);
                return;
            }
            navigate('/register/gender');
        } else {
            alert("Por favor, selecciona tu fecha de nacimiento.");
        }
    };

    return (
        <AnimatedStep>
            <div className="w-full max-w-md px-6 flex flex-col items-center">
                
                <div className="w-full text-left mb-8">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                        ¿Cuándo naciste?
                    </h1>
                    <p className="text-bluvi-purple/70 text-lg font-medium">
                        Esto nos ayuda a asegurar que Bluvi sea un espacio seguro.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-6 mb-20">
                    <DatePicker 
                        label="Fecha de Nacimiento"
                        value={calendarValue} 
                        onChange={(newDate) => {
                            if (newDate) {
                                updateFormData({ birthDate: newDate.toString() });
                            }
                        }}
                            />

                    <p className="text-sm text-bluvi-purple/60 italic font-medium ml-2">
                        * Tu fecha de nacimiento no será pública en tu perfil.
                    </p>
                </div>

                <div className="w-full">
                    <Button 
                        aria-label="Ir al siguiente paso" 
                        disabled={!formData.birthDate} 
                        className={`w-full py-3.5 text-lg shadow-md transition-all ${
                            !formData.birthDate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                        }`}
                        onClick={handleNext}
                    >
                        Siguiente
                    </Button>
                </div>

            </div>
        </AnimatedStep>
    );
};