import React from 'react';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import logo from '../assets/logo.svg';
import { SettingsButton } from '../components/SettingsButton';
import { useNavigate } from 'react-router-dom';

    export const Welcome: React.FC = () => {
        const navigate = useNavigate();
        return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center justify-between font-sans overflow-hidden">
        
        <div className="w-full flex justify-end p-8">
            <SettingsButton onClick={() => console.log("Abrir menú de accesibilidad")} />
        </div>

        <div className="flex flex-col items-center gap-20 w-full max-w-md px-6 -mt-30">
            
            <img src={logo} alt="Bluvi" className="w-[700px] max-w-[95vw] h-auto drop-shadow-sm mb-4" />

            <h1 className="font-heading text-2xl md:text-2xl font-bold text-bluvi-purple text-center mb-3 tracking-wide">
                Conectar es simple
            </h1> 

            <div className="flex flex-col w-72">
            <Button onClick={() => navigate('/intro')} ariaLabel="Empezar" className="w-full py-3 shadow-md font-semibold">
                Empezar
            </Button>

            </div>
        </div>

        <Footer />
        </main>
    );
};