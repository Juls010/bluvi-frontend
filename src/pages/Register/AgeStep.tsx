import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { Button } from '../../components/Button';
import { DatePicker } from '../../components/DatePicker';
import { useRegister } from '../../context/RegisterContext';
import { CalendarDate, parseDate } from '@internationalized/date';

const MIN_AGE = 18;

const getMaxBirthDate = () => {
    const today = new Date();
    return `${today.getFullYear() - MIN_AGE}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const isValidIsoDate = (value: string) => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

const normalizeIsoDate = (value: string) => {
    const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) return value;

    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const isAtLeastAge = (birthDateIso: string, minAge: number) => {
    const [year, month, day] = birthDateIso.split('-').map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;
    const hasNotHadBirthdayThisYear =
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day);

    if (hasNotHadBirthdayThisYear) {
        age -= 1;
    }

    return age >= minAge;
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
                        defaultValue={defaultCalendarValue ?? undefined}
                        onChange={handleBirthDateChange}
                        maxValue={maxBirthDateValue}
                        shouldForceLeadingZeros
                        description={`Debes tener al menos ${MIN_AGE} años.`}
                        errorMessage={error || undefined}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                    />

                    <p className="text-sm text-bluvi-purple/60 italic font-medium ml-2" id={errorId}>
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