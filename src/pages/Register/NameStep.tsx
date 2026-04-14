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
            if (firstNameHasError && firstNameInputRef.current) {
                firstNameInputRef.current.focus();
            } else if (lastNameHasError && lastNameInputRef.current) {
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
            <div className="w-full max-w-md px-6 animate-fade-in">

                <RegisterStepHeader
                    title="¿Cómo te llamas?"
                    subtitle="¡Nos emociona conocerte!"
                    className="mb-8"
                />

                <div className="w-full flex flex-col gap-6 mb-20">
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

                <div className="w-full">
                    <Button
                        onClick={handleNext}
                        aria-label="Siguiente"
                        className={`w-full py-3.5 shadow-md transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isValid}
                    >
                        Siguiente
                    </Button>
                </div>

            </div>
        </AnimatedStep>
    );
};