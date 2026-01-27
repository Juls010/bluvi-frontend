import React from 'react';

interface InputFieldProps {label: string;placeholder?: string;value?: string;onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;type?: string;id: string; }

    export const InputField: React.FC<InputFieldProps> = ({label, placeholder, value, onChange, type = "text",id}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="text-bluvi-purple text-lg font-medium font-sans pl-1">
            {label}
        </label>

        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="
                w-full 
                px-4 py-2 
                rounded-xl 
                bg-white/50 
                border-2 border-bluvi-purple/30 
                text-bluvi-purple 
                placeholder:text-bluvi-purple/40
                font-sans
                text-lg
                
                focus:outline-none 
                focus:border-bluvi-purple 
                focus:ring-4 focus:ring-bluvi-purple/10
                transition-all duration-300
            "
        />
        </div>
    );
};