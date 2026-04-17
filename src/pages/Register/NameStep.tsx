import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

const PERSON_NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

const sanitizeNameInput = (value: string) =>
    value
        .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, '')
        .replace(/\s{2,}/g, ' ')
        .slice(0, 80);

const isOnlyLettersAndSpaces = (value: string) => PERSON_NAME_REGEX.test(value.trim());


export const NameStep: React.FC = () => {
    const navigate = useNavigate();
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [isFirstNameTouched, setIsFirstNameTouched] = useState(false);
    const [isLastNameTouched, setIsLastNameTouched] = useState(false);

    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);

    const { formData, updateFormData } = useRegister();

    const firstNameValue = formData.firstName ?? '';
    const lastNameValue = formData.lastName ?? '';
    const firstNameTrimmed = firstNameValue.trim();
    const lastNameTrimmed = lastNameValue.trim();

    const hasFirstName = firstNameTrimmed.length > 0;
    const hasLastName = lastNameTrimmed.length > 0;

    const isFirstNameFormatValid = hasFirstName && isOnlyLettersAndSpaces(firstNameValue);
    const isLastNameFormatValid = hasLastName && isOnlyLettersAndSpaces(lastNameValue);

    const shouldValidateFirstName = isFirstNameTouched || hasAttemptedSubmit;
    const shouldValidateLastName = isLastNameTouched || hasAttemptedSubmit;

    const firstNameError = shouldValidateFirstName
        ? !hasFirstName
            ? 'Introduce tu nombre.'
            : !isFirstNameFormatValid
                ? 'Solo se permiten letras y espacios.'
                : ''
        : '';

    const lastNameError = shouldValidateLastName
        ? !hasLastName
            ? 'Introduce al menos un apellido.'
            : !isLastNameFormatValid
                ? 'Solo se permiten letras y espacios.'
                : ''
        : '';

    const firstNameHasError = firstNameError.length > 0;
    const lastNameHasError = lastNameError.length > 0;

    // IDs para mensajes de error
    const firstNameErrorId = firstNameHasError ? 'firstName-error' : undefined;
    const lastNameErrorId = lastNameHasError ? 'lastName-error' : undefined;

    const isValid = hasFirstName && hasLastName && isFirstNameFormatValid && isLastNameFormatValid;

    const handleNext = () => {
        setHasAttemptedSubmit(true);
        
        if (!isValid) {
            const isFirstNameInvalid = !hasFirstName || !isFirstNameFormatValid;
            const isLastNameInvalid = !hasLastName || !isLastNameFormatValid;

            if (isFirstNameInvalid && firstNameInputRef.current) {
                firstNameInputRef.current.focus();
            } else if (isLastNameInvalid && lastNameInputRef.current) {
                lastNameInputRef.current.focus();
            }
            return;
        }
        navigate('/register/age');
    };

    const handleFirstNameChange = (value: string) => {
        if (!isFirstNameTouched) {
            setIsFirstNameTouched(true);
        }
        updateFormData({ firstName: sanitizeNameInput(value) });
    };

    const handleLastNameChange = (value: string) => {
        if (!isLastNameTouched) {
            setIsLastNameTouched(true);
        }
        updateFormData({ lastName: sanitizeNameInput(value) });
    };

    const clearFirstName = () => {
        setIsFirstNameTouched(true);
        updateFormData({ firstName: '' });
    };

    const clearLastName = () => {
        setIsLastNameTouched(true);
        updateFormData({ lastName: '' });
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">

                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="¿Cómo te llamas?"
                            subtitle="¡Nos emociona conocerte!"
                            align="left"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center">
                        <div className="flex flex-col gap-6 w-full max-w-sm">
                            <InputField
                                id="nombre"
                                label="Nombre"
                                value={formData.firstName}
                                onChange={(e) => handleFirstNameChange(e.target.value)}
                                placeholder="Aurora"
                                state={firstNameHasError ? 'error' : 'default'}
                                helperText={firstNameError}
                                clearable
                                onClear={clearFirstName}
                                clearLabel="Limpiar nombre"
                                inputRef={firstNameInputRef}
                                aria-invalid={firstNameHasError}
                                aria-describedby={firstNameErrorId}
                            />
                            <InputField
                                id="apellidos"
                                label="Apellidos"
                                value={formData.lastName}
                                onChange={(e) => handleLastNameChange(e.target.value)}
                                placeholder="Montenegro"
                                state={lastNameHasError ? 'error' : 'default'}
                                helperText={lastNameError}
                                clearable
                                onClear={clearLastName}
                                clearLabel="Limpiar apellidos"
                                inputRef={lastNameInputRef}
                                aria-invalid={lastNameHasError}
                                aria-describedby={lastNameErrorId}
                            />
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button
                            onClick={handleNext}
                            aria-label="Siguiente"
                            className={`w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98'}`}
                            disabled={!isValid}
                        >
                            Siguiente
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};
