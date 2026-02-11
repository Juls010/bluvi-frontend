import React, { createContext, useContext, useState,  } from 'react';

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
    data: RegisterData;
    updateData: (newData: Partial<RegisterData>) => void;
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

    return (
        <RegisterContext.Provider value={{ data, updateData }}>
        {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error('useRegister debe usarse dentro de un RegisterProvider');
    return context;
};