import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/auth.service';

interface RegisterData {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: number | ''; 
    sexuality: number | ''; 
    neurodivergences: number[]; 
    communicationStyle: number[]; 
    email: string;
    password: string;
    photos: (string | null)[];
    city: string;
    interests: number[]; 
    description: string;
}

interface RegisterContextType {
    formData: RegisterData; 
    updateFormData: (newData: Partial<RegisterData>) => void; 
    sendToBackend: () => Promise<boolean>;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '', 
        sexuality: '',
        neurodivergences: [],
        communicationStyle: [],
        email: '',
        password: '',
        photos: [null, null, null, null, null],
        city: '',
        interests: [],
        description: '',
    });

    const updateFormData = (newData: Partial<RegisterData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const sendToBackend = async () => {
        try {
            console.log("🚀 Enviando datos profesionales al Backend:", formData);
            
            // Ya no necesitamos 'mappedData' porque los componentes ahora 
            // guardarán directamente el ID en el estado.
            const result = await authService.register(formData);

            if (result.success) {
                console.log("✨ Registro completado con éxito");
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Error detallado:", error.response?.data);
            alert("Error del servidor: " + (error.response?.data?.message || "Revisa la consola del Back"));
            return false;
        }
    };

    return (
        <RegisterContext.Provider value={{ formData, updateFormData, sendToBackend }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error('useRegister debe usarse dentro de un RegisterProvider');
    return context;
};