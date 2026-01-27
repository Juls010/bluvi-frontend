import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { SettingsButton } from '../../components/SettingsButton';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';

export const NameStep: React.FC = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleNext = () => {
        console.log("Nombre:", firstName, "Apellidos:", lastName);
        // navigate('/register/email'); // Ejemplo de siguiente paso
    };

    return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center font-sans overflow-hidden">
        
        <div className="w-full flex justify-end p-8">
            <SettingsButton onClick={() => console.log("Ajustes")} />
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md px-6 -mt-30 animate-fade-in">
            
            <div className="w-full text-left mb-8"> 
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                ¿Cómo te llamas?
            </h1>
            <p className="text-bluvi-purple/70 text-lg font-medium">
                ¡Nos emociona conocerte!
            </p>
            </div>

            <div className="w-full flex flex-col gap-7 mb-30">
            <InputField id="nombre"label="Nombre" placeholder="Aurora" value={firstName}onChange={(e) => setFirstName(e.target.value)} />
            
            <InputField id="apellidos" label="Apellidos" placeholder="Montenegro Almendra"value={lastName}onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className="w-full">
            <Button ariaLabel="Ir al siguiente paso del registro" className="w-full py-3.5 text-lg shadow-md"onClick={handleNext}>
                Siguiente
            </Button>
            </div>

        </div>
        </main>
    );
};