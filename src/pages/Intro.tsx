import React from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const Intro: React.FC = () => {
    const navigate = useNavigate();

    const handleAgree = () => {
        // 1. Guardamos en la memoria del navegador que el usuario YA vio esto
        localStorage.setItem('hasSeenIntro', 'true');
        navigate('/landing');
    };

    return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex items-center justify-center p-6 font-sans">
        
        <div className="max-w-2xl w-full flex flex-col gap-8 animate-fade-in">
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
            Tu viaje, tu espacio
            </h1>

            <div className="space-y-6 text-bluvi-purple/90 text-lg font-medium leading-relaxed font-sans">
            <p>
                Bluvi es una comunidad pensada para conectar con 
                seguridad, libertad y respeto.
            </p>
            
            <p>
                Queremos que cada persona sienta este espacio 
                como suyo, celebrando la diversidad y el bienestar 
                común.
            </p>
            
            <p>
                Mantenemos una política firme contra cualquier 
                forma de discriminación o acoso.
            </p>
            
            <p>
                Si algo te resulta incómodo o confuso, por favor denúncialo; estamos aquí para apoyarte.
            </p>
            
            <p>
                Recuerda: estamos aquí para conectar. <span className="font-bold text-bluvi-purple ml-1">Sé claro, sé tú y sé amable.</span>
            </p>
            </div>

            <div className="pt-15 flex justify-center">
            <Button ariaLabel="Estoy de acuerdo con las normas de la comunidad" className="px-20 py-3"onClick={handleAgree}>
                Estoy de acuerdo
            </Button>
            </div>

        </div>
        </main>
    );
};