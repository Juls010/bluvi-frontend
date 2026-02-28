import React from 'react';
import { Button } from '../../components/Button';
import { Footer } from '../../components/Footer';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';

    export const Welcome: React.FC = () => {
        const navigate = useNavigate();
        return (
            <AnimatedStep className="justify-between">
                
            <div className="h-4" />

            <div className="flex flex-col items-center gap-12 w-full max-w-md px-6">
                
                <img 
                    src={logo} 
                    alt="Bluvi" 
                    className="w-[700px] max-w-[95vw] h-auto drop-shadow-sm mb-4" 
                />

                <h1 className="font-heading text-2xl md:text-2xl font-bold text-bluvi-purple text-center mb-3 tracking-wide">
                    Conectar es simple
                </h1> 

                <div className="flex flex-col w-72">
                    <Button 
                        onClick={() => navigate('/intro')} 
                        aria-label="Empezar" 
                        className="w-full py-3 shadow-md font-semibold"
                    >
                        Empezar
                    </Button>
                </div>
            </div>

            <Footer />
        </AnimatedStep>
    );
};