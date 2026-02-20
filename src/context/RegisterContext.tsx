import React, { createContext, useContext, useState } from 'react';

interface RegisterData {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    sexuality: string;
    neurodivergences: string[];
    communicationStyle: string[];
    email: string;
    password: string;
    documentFile: File | null; 
}

interface RegisterContextType {
    formData: RegisterData; // Más descriptivo que 'data'
    updateFormData: (newData: Partial<RegisterData>) => void; // Más descriptivo que 'updateData'
    sendToBackend: () => Promise<boolean>;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: "",
        sexuality: "",
        neurodivergences: [],
        communicationStyle: [],
        email: '',
        password: '',
        documentFile: null,
    });

    const updateData = (newData: Partial<RegisterData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    // Función para conectar con el servidor que creamos antes
    const sendToBackend = async () => {
        try {
            console.log("🚀 Enviando datos a la API de Bluvi:", data);
            
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            return response.ok;
        } catch (error) {
            console.error("❌ Error de conexión con el Backend:", error);
            return false;
        }
    };

    return (
        <RegisterContext.Provider value={{ formData: data, updateFormData: updateData, sendToBackend }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error('useRegister debe usarse dentro de un RegisterProvider');
    return context;
};