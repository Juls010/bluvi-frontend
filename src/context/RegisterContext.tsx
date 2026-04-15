import React, { createContext, useContext, useState } from 'react';
import { authService, type RegisterPayload } from '../services/auth.service';

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

type RegisterBackupData = Omit<RegisterData, 'password'>;

const PERSON_NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATA_URI_OR_HTTP_URL_REGEX = /^(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\r\n]+|https?:\/\/\S+)$/;

const DEFAULT_REGISTER_DATA: RegisterData = {
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
};

const sanitizePlainText = (value: string, maxLength: number) =>
    value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLength);

const sanitizeEmail = (value: string) => sanitizePlainText(value, 254).replace(/\s+/g, '');

const serializeBackupData = (data: RegisterData): RegisterBackupData => ({
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    gender: data.gender,
    sexuality: data.sexuality,
    neurodivergences: data.neurodivergences,
    communicationStyle: data.communicationStyle,
    email: data.email,
    photos: data.photos,
    city: data.city,
    interests: data.interests,
    description: data.description,
});

const sanitizeRegisterPatch = (newData: Partial<RegisterData>): Partial<RegisterData> => {
    const sanitized: Partial<RegisterData> = { ...newData };

    if (typeof newData.firstName === 'string') {
        sanitized.firstName = sanitizePlainText(newData.firstName, 80);
    }

    if (typeof newData.lastName === 'string') {
        sanitized.lastName = sanitizePlainText(newData.lastName, 80);
    }

    if (typeof newData.email === 'string') {
        sanitized.email = sanitizeEmail(newData.email);
    }

    if (typeof newData.password === 'string') {
        sanitized.password = sanitizePlainText(newData.password, 128);
    }

    if (typeof newData.city === 'string') {
        sanitized.city = sanitizePlainText(newData.city, 120);
    }

    if (typeof newData.description === 'string') {
        sanitized.description = sanitizePlainText(newData.description, 1200);
    }

    if (Array.isArray(newData.photos)) {
        sanitized.photos = newData.photos.slice(0, 5).map((photo) => {
            if (typeof photo !== 'string') {
                return null;
            }
            const cleanPhoto = photo.trim();
            return cleanPhoto.length > 0 ? cleanPhoto.slice(0, 2_000_000) : null;
        });
    }

    if (Array.isArray(newData.neurodivergences)) {
        sanitized.neurodivergences = [...new Set(newData.neurodivergences.filter((value) => Number.isInteger(value) && value > 0))];
    }

    if (Array.isArray(newData.communicationStyle)) {
        sanitized.communicationStyle = [...new Set(newData.communicationStyle.filter((value) => Number.isInteger(value) && value > 0))];
    }

    if (Array.isArray(newData.interests)) {
        sanitized.interests = [...new Set(newData.interests.filter((value) => Number.isInteger(value) && value > 0))];
    }

    return sanitized;
};

const normalizeRegisterData = (raw: unknown): RegisterData => {
    if (!raw || typeof raw !== 'object') {
        return DEFAULT_REGISTER_DATA;
    }

    const data = raw as Partial<RegisterData>;

    const photos = Array.isArray(data.photos)
        ? data.photos.slice(0, 5).map((photo) => (typeof photo === 'string' && photo.length > 0 ? photo : null))
        : DEFAULT_REGISTER_DATA.photos;

    while (photos.length < 5) {
        photos.push(null);
    }

    return {
        firstName: typeof data.firstName === 'string' ? data.firstName : '',
        lastName: typeof data.lastName === 'string' ? data.lastName : '',
        birthDate: typeof data.birthDate === 'string' ? data.birthDate : '',
        gender: typeof data.gender === 'number' ? data.gender : '',
        sexuality: typeof data.sexuality === 'number' ? data.sexuality : '',
        neurodivergences: Array.isArray(data.neurodivergences)
            ? data.neurodivergences.filter((v): v is number => typeof v === 'number')
            : [],
        communicationStyle: Array.isArray(data.communicationStyle)
            ? data.communicationStyle.filter((v): v is number => typeof v === 'number')
            : [],
        email: typeof data.email === 'string' ? data.email : '',
        password: '',
        photos,
        city: typeof data.city === 'string' ? data.city : '',
        interests: Array.isArray(data.interests)
            ? data.interests.filter((v): v is number => typeof v === 'number')
            : [],
        description: typeof data.description === 'string' ? data.description : '',
    };
};

const isPositiveIntegerArray = (value: number[], maxItems: number) =>
    Array.isArray(value) && value.length <= maxItems && value.every((item) => Number.isInteger(item) && item > 0);

const validateMappedRegisterData = (payload: RegisterPayload): string | null => {
    if (!EMAIL_REGEX.test(payload.email) || payload.email.length > 254) {
        return 'El correo no es valido.';
    }

    if (payload.password.length < 8 || payload.password.length > 72) {
        return 'La contraseña debe tener entre 8 y 72 caracteres.';
    }

    if (!payload.first_name || payload.first_name.length > 80 || !PERSON_NAME_REGEX.test(payload.first_name)) {
        return 'El nombre es invalido. Solo se permiten letras y espacios.';
    }

    if (!payload.last_name || payload.last_name.length > 80 || !PERSON_NAME_REGEX.test(payload.last_name)) {
        return 'El apellido es invalido. Solo se permiten letras y espacios.';
    }

    if (!ISO_DATE_REGEX.test(payload.birth_date)) {
        return 'La fecha de nacimiento no es valida.';
    }

    if (payload.id_gender === null || !Number.isInteger(payload.id_gender) || payload.id_gender <= 0) {
        return 'Selecciona un genero valido.';
    }

    if (payload.id_preference === null || !Number.isInteger(payload.id_preference) || payload.id_preference <= 0) {
        return 'Selecciona una preferencia valida.';
    }

    if (!payload.city || payload.city.length > 120) {
        return 'La ciudad no es valida.';
    }

    if (!payload.description || payload.description.length > 1200) {
        return 'La descripcion no es valida.';
    }

    if (!isPositiveIntegerArray(payload.interests, 50)) {
        return 'Los intereses contienen valores no validos.';
    }

    if (!isPositiveIntegerArray(payload.neurodivergences, 50)) {
        return 'Las neurodivergencias contienen valores no validos.';
    }

    if (!isPositiveIntegerArray(payload.communication_style, 50)) {
        return 'El estilo de comunicacion contiene valores no validos.';
    }

    if (!Array.isArray(payload.photos) || payload.photos.length > 8) {
        return 'El numero de fotos no es valido.';
    }

    const hasInvalidPhoto = payload.photos.some(
        (photo) => photo.length === 0 || photo.length > 2_000_000 || !DATA_URI_OR_HTTP_URL_REGEX.test(photo)
    );

    if (hasInvalidPhoto) {
        return 'Hay fotos con un formato no valido.';
    }

    return null;
};

interface RegisterContextType {
    formData: RegisterData; 
    updateFormData: (newData: Partial<RegisterData>) => void; 
    sendToBackend: () => Promise<boolean>;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setData] = useState<RegisterData>(() => {
        try {
            const saved = localStorage.getItem('bluvi_reg_backup');
            return saved ? normalizeRegisterData(JSON.parse(saved)) : DEFAULT_REGISTER_DATA;
        } catch {
            return DEFAULT_REGISTER_DATA;
        }
    });

    const updateFormData = (newData: Partial<RegisterData>) => {
        setData((prev) => {
            const sanitizedPatch = sanitizeRegisterPatch(newData);
            const updated = { ...prev, ...sanitizedPatch };
            localStorage.setItem('bluvi_reg_backup', JSON.stringify(serializeBackupData(updated)));
            return updated;
        });
    };

    const sendToBackend = async () => {
        try {
            const mappedData: RegisterPayload = {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                birth_date: formData.birthDate,
                city: formData.city.trim(),
                description: formData.description.trim(),
                id_gender: formData.gender !== '' ? Number(formData.gender) : null,
                id_preference: formData.sexuality !== '' ? Number(formData.sexuality) : null,
                neurodivergences: formData.neurodivergences,
                communication_style: formData.communicationStyle,
                interests: formData.interests,
                photos: formData.photos.filter((photo): photo is string => typeof photo === 'string' && photo.length > 0)
            };

            const validationError = validateMappedRegisterData(mappedData);
            if (validationError) {
                throw new Error(validationError + (formData.password === '' ? ' (Es posible que se haya borrado la contraseña al refrescar la página, por favor vuelve atrás para introducirla)' : ''));
            }

            const result = await authService.register(mappedData);
            
            if (result.success) {
                localStorage.setItem('temp_email_verification', formData.email);
                localStorage.removeItem('bluvi_reg_backup');
                setData((prev) => ({ ...prev, password: '' }));
                return true;
            }
            return false;
            
        } catch (error: any) {
            console.error("Error en registro:", error);
            const serverMessage = error.response?.data?.message || error.message || 'Error desconocido al procesar el registro';
            throw new Error(serverMessage);
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
