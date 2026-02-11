import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SettingsButton } from '../components/SettingsButton';

export const RegisterLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        // 1. EL CONTENEDOR PRINCIPAL (Fondo degradado)
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center font-sans overflow-hidden">
        
        {/* 2. EL HEADER COMÚN (Botón volver y Ajustes) */}
        <div className="w-full flex justify-between p-8 items-center z-10">
            <button 
                onClick={() => navigate(-1)} 
                className="text-bluvi-purple/60 hover:text-bluvi-purple font-medium transition-colors cursor-pointer"
            >
                ← Volver
            </button>
            
            {/* Aquí podrías poner tu barra de progreso en el futuro */}
            
            <SettingsButton onClick={() => console.log("Ajustes")} />
        </div>

        {/* 3. EL HUECO PARA EL CONTENIDO (Outlet) */}
        {/* Aquí es donde React "pintará" NameStep, EmailStep, etc. */}
        <div className="flex-1 w-full flex flex-col items-center justify-center -mt-20">
            <Outlet /> 
        </div>

        </main>
    );
};