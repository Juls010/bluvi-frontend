import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface InputFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    id: string;
    state?: 'default' | 'success' | 'error';
    helperText?: string;
    clearable?: boolean;
    onClear?: () => void;
    clearLabel?: string;
    inputRef?: React.Ref<HTMLInputElement>;
    ['aria-invalid']?: boolean;
    ['aria-describedby']?: string;
    required?: boolean;
    maxLength?: number;
    name?: string;
    autoComplete?: string;
    disabled?: boolean;
}

    export const InputField: React.FC<InputFieldProps> = ({
        label,
        placeholder,
        value,
        onChange,
        type = "text",
        id,
        state = 'default',
        helperText,
        clearable = false,
        onClear,
        clearLabel = 'Limpiar campo',
        inputRef,
        ['aria-invalid']: ariaInvalid,
        ['aria-describedby']: ariaDescribedby,
        required,
        maxLength,
        name,
        autoComplete,
        disabled
    }) => {
    
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === 'password';
    const shouldShowClearButton = clearable && !isPasswordType && typeof value === 'string' && value.length > 0;

    const currentType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    const getBorderColor = () => {
        if (state === 'success') return 'border-green-500 focus:border-green-600 focus:ring-green-500/10';
        if (state === 'error') return 'border-red-400 focus:border-red-500 focus:ring-red-500/10';
        return 'border-bluvi-purple/30 focus:border-bluvi-purple focus:ring-bluvi-purple/10';
    };

    const finalAriaDescribedBy = ariaDescribedby || (helperText ? `${id}-helper` : undefined);
    const finalAriaInvalid = ariaInvalid !== undefined ? ariaInvalid : state === 'error';

    return (
        <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="text-bluvi-purple text-lg font-medium font-sans pl-1">
            {label}
        </label>

        <div className="relative w-full">
            <input
                id={id}
                ref={inputRef}
                type={currentType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3 rounded-xl bg-white/50 text-bluvi-purple placeholder:text-bluvi-purple/40 font-sans text-lg
                    border-2 transition-all duration-300 focus:outline-none focus:ring-4
                    ${getBorderColor()}
                    ${isPasswordType || shouldShowClearButton ? 'pr-12' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed select-none bg-gray-100/30' : ''}
                `}
                aria-invalid={finalAriaInvalid}
                aria-describedby={finalAriaDescribedBy}
                required={required}
                maxLength={maxLength}
                name={name}
                autoComplete={autoComplete}
                disabled={disabled}
            />

            {shouldShowClearButton && (
            <button
                type="button"
                onClick={onClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bluvi-purple/45 hover:text-bluvi-purple transition-all duration-300 rounded-full p-1.5 hover:bg-bluvi-purple/5 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/30"
                aria-label={clearLabel}
            >
                <X size={18} strokeWidth={2} />
            </button>
            )}

            {isPasswordType && (
            <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bluvi-purple/60 hover:text-bluvi-purple transition-all duration-300 p-1.5 rounded-full hover:bg-bluvi-purple/5 active:scale-90"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
            >
                {showPassword ? (
                    <EyeOff size={20} strokeWidth={2} />
                ) : (
                    <Eye size={20} strokeWidth={2} />
                )}
            </button>
            )}
        </div>

        {helperText && (
            <p
                id={finalAriaDescribedBy}
                className={`text-sm pl-1 ${state === 'error' ? 'text-red-500' : 'text-bluvi-purple/60'}`}
                aria-live={state === 'error' ? 'assertive' : undefined}
            >
                {helperText}
            </p>
        )}
        </div>
    );
};
