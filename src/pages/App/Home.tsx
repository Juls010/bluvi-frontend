import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg'; 

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center animate-fade-in motion-reduce:animate-none px-6">
            
            <div className="mb-8 mt-4">
                <img 
                    src={logo} 
                    alt="Logotipo de Bluvi" 
                    className="w-80 md:w-[500px] h-auto object-contain drop-shadow-xl" 
                />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-bluvi-purple mb-4">
                Empieza a crear <br className="hidden md:block" /> conexiones únicas
            </h1>

            <p className="text-bluvi-purple text-lg mb-10 max-w-md mx-auto font-medium">
                Encuentra personas que vibran en tu misma frecuencia. Un espacio seguro para ser tú.
            </p>

            <div className="w-full max-w-xs">
                    
                <Button 
                    onClick={() => navigate('/app/discovery')} 
                    className="w-full py-3 text-lg text-white shadow-xl shadow-bluvi-purple/20 focus:ring-4 focus:ring-bluvi-purple/50"    
                >
                    Explorar
                </Button>
            </div>

        </div>
    );
};