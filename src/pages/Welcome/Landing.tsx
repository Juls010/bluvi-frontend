import React from 'react';
import { Button } from '../../components/Button';
import { Footer } from '../../components/Footer';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';

    export const Landing: React.FC = () => {
        const navigate = useNavigate();
    return (
        <AnimatedStep>
            <div className="flex flex-col items-center gap-12 w-full max-w-md px-6">
                
                <img src={logo} alt="Bluvi" className="w-[700px] max-w-[95vw] h-auto drop-shadow-sm mb-4" />

                <div className="flex flex-col gap-7 w-72">
                <Button aria-label="Registrarse" className="w-full py-3"onClick={() => navigate('/register/name')}>
                    Registrarse
                </Button>
                <Button aria-label="Iniciar Sesión" className="w-full py-3" onClick={() => navigate('/login')}>
                    Iniciar Sesión
                </Button>
                </div>
            </div>

            <Footer />
        </AnimatedStep>
    );
};