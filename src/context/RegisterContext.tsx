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
    // 1. Cargamos el estado inicial desde localStorage (si existe)
    const [formData, setData] = useState<RegisterData>(() => {
        const saved = localStorage.getItem('bluvi_reg_backup');
        return saved ? JSON.parse(saved) : {
            firstName: '', lastName: '', birthDate: '', gender: '', 
            sexuality: '', neurodivergences: [], communicationStyle: [],
            email: '', password: '', photos: [null, null, null, null, null],
            city: '', interests: [], description: '',
        };
    });

    // 2. Al actualizar, guardamos una copia de seguridad automática
    const updateFormData = (newData: Partial<RegisterData>) => {
        setData((prev) => {
            const updated = { ...prev, ...newData };
            localStorage.setItem('bluvi_reg_backup', JSON.stringify(updated));
            return updated;
        });
    };

    const sendToBackend = async () => {
        console.log("Verificando maleta antes de enviar:", formData);
        
        try {
            const mappedData = {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                birth_date: formData.birthDate,
                city: formData.city,
                description: formData.description,
                id_gender: formData.gender !== '' ? Number(formData.gender) : null,
                id_preference: formData.sexuality !== '' ? Number(formData.sexuality) : null,
                neurodivergences: formData.neurodivergences,
                communication_style: formData.communicationStyle,
                interests: formData.interests,
                photos: formData.photos
            };

            // VALIDACIÓN CRÍTICA: Si la fecha está vacía aquí, detenemos el proceso
            if (!mappedData.birth_date) {
                alert("La fecha de nacimiento se ha perdido. Por favor, vuelve al paso de edad.");
                return false;
            }

            const result = await authService.register(mappedData);
            
            if (result.success) {
                localStorage.setItem('temp_email_verification', formData.email);
                localStorage.removeItem('bluvi_reg_backup'); 
                return true;
            }
            return false;
            
        } catch (error: any) {
            console.error("Error en registro:", error);
            return false;
        }
    };

    return (
        <RegisterContext.Provider value={{ formData, updateFormData, sendToBackend }}>
            {children}
        </RegisterContext.Provider>
    );
};

/*
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
        console.log("💾 CONTEXTO RECIBE:", newData);
        setData((prev) => ({ ...prev, ...newData }));
    };

    const sendToBackend = async () => {
        console.log("📦 ESTADO BRUTO (formData):", formData);
        try {
            // Mapeo exacto según tu definición de tabla public.users
            const mappedData = {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                birth_date: formData.birthDate, // Aquí ya va el YYYY-MM-DD con ceros
                city: formData.city,
                description: formData.description,
                id_gender: formData.gender !== '' ? Number(formData.gender) : null,
                // id_preference en tu tabla es varchar(50), enviamos la sexualidad ahí
                id_preference: String(formData.sexuality), 
                
                // Estos campos no están en la tabla users directamente (irán a tablas relacionales)
                // pero los enviamos para que el controlador los procese:
                neurodivergences: formData.neurodivergences,
                communication_style: formData.communicationStyle,
                interests: formData.interests,
                photos: formData.photos
            };

            console.log("🚀 ENVIANDO A API (mappedData):", mappedData);

            const result = await authService.register(mappedData);

            if (result.success) return true;
            return false;
        } catch (error: any) {
            console.error("❌ Error en el registro:", error.response?.data);
            return false;
        }
    };

    return (
        <RegisterContext.Provider value={{ formData, updateFormData, sendToBackend }}>
            {children}
        </RegisterContext.Provider>
    );
};
*/

export const useRegister = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error('useRegister debe usarse dentro de un RegisterProvider');
    return context;
};