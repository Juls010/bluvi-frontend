import React, { useMemo, useState } from 'react';
import {
    useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { Button } from '../../components/Button';
import { DatePicker } from '../../components/DatePicker';
import { useRegister } from '../../context/RegisterContext';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { InfoIcon
} from '@phosphor-icons/react';
import { CalendarDate, parseDate } from '@internationalized/date';
import { isValidIsoDate, normalizeIsoDate, isAtLeastAge } from './ageStepUtils';

const MIN_AGE = 18;

const getMaxBirthDate = () => {
    const today = new Date();
    return `${today.getFullYear() - MIN_AGE}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const AgeStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    const [error, setError] = useState('');
    const maxBirthDate = useMemo(() => getMaxBirthDate(), []);
    const maxBirthDateValue = useMemo(() => parseDate(maxBirthDate), [maxBirthDate]);

    let defaultCalendarValue: CalendarDate | null = null;
    try {
        if (formData.birthDate) {
            defaultCalendarValue = parseDate(formData.birthDate);
        }
    } catch {
        defaultCalendarValue = null;
    }

    const handleNext = () => {
        const birthDate = normalizeIsoDate(formData.birthDate);

        if (!birthDate) {
            setError('Por favor, selecciona tu fecha de nacimiento.');
            return;
        }

        if (!isValidIsoDate(birthDate)) {
            setError('La fecha introducida no es valida.');
            return;
        }

        if (!isAtLeastAge(birthDate, MIN_AGE)) {
            setError(`Debes tener al menos ${MIN_AGE} años para unirte a Bluvi.`);
            return;
        }

        if (birthDate !== formData.birthDate) {
            updateFormData({ birthDate });
        }

        setError('');
        navigate('/register/gender');
    };

    const handleBirthDateChange = (newDate: CalendarDate | null) => {
        if (!newDate) {
            return;
        }

        const value = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`;
        updateFormData({ birthDate: value });
        if (error) {
            setError('');
        }
    };

    const errorId = error ? 'birthdate-error' : undefined;

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">
                    
                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="¿Cuándo naciste?"
                            subtitle="Esto nos ayuda a asegurar que Bluvi sea un espacio seguro."
                            align="left"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center">
                        <div className="flex flex-col gap-8 md:gap-12 w-full items-center">
                            <DatePicker
                                label="Fecha de Nacimiento"
                                defaultValue={defaultCalendarValue ?? undefined}
                                onChange={handleBirthDateChange}
                                maxValue={maxBirthDateValue}
                                shouldForceLeadingZeros
                                description={`Debes tener al menos ${MIN_AGE} años.`}
                                errorMessage={error || undefined}
                                aria-invalid={!!error}
                                aria-describedby={errorId}
                            />

                            <div className="mt-4 bg-white/20 backdrop-blur-sm border border-white/40 p-4 rounded-2xl flex items-start gap-3 max-w-sm mx-auto shadow-sm">
                                <InfoIcon className="text-bluvi-purple shrink-0 mt-0.5" size={18} weight="bold" />
                                <p className="text-sm text-gray-700 italic leading-relaxed" id={errorId}>
                                    Tu fecha de nacimiento no será pública en tu perfil.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button
                            aria-label="Ir al siguiente paso"
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all ${
                                !formData.birthDate ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98'
                            }`}
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
