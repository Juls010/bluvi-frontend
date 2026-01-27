import React from 'react';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import logo from '../assets/logo.svg';
import { SettingsButton } from '../components/SettingsButton';
import { useNavigate } from 'react-router-dom';

    export const Landing: React.FC = () => {
        const navigate = useNavigate();
    return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center justify-between font-sans overflow-hidden">
        
        <div className="w-full flex justify-end p-8">
            <SettingsButton onClick={() => console.log("Abrir menú de accesibilidad")} />
        </div>

        <div className="flex flex-col items-center gap-30 w-full max-w-md px-6 -mt-30">
            
            <img src={logo} alt="Bluvi" className="w-[700px] max-w-[95vw] h-auto drop-shadow-sm mb-4" />

            <div className="flex flex-col gap-7 w-72">
            <Button ariaLabel="Registrarse" className="w-full py-3"onClick={() => navigate('/register/name')}>
                Registrarse
            </Button>
            <Button ariaLabel="Iniciar Sesión" className="w-full py-3" onClick={() => console.log("Ir a Login (pendiente)")}>
                Iniciar Sesión
            </Button>
            </div>
        </div>

        <Footer />
        </main>
    );
};