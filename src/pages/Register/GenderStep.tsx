import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

export const GenderStep: React.FC = () => {
    const navigate = useNavigate();
    const { data, updateData } = useRegister();

    const genderOptions = ['Hombre', 'Mujer', 'No binarie'];

    const handleNext = () => {
        if (!data.gender) return;
        navigate('/register/sexuality'); 
    };

    return (
        <div className="w-full max-w-md px-6 animate-fade-in">

        <div className="w-full text-left mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
            ¿Con qué género te identificas?
            </h1>
            <p className="text-bluvi-purple/70 text-lg font-medium">
            Queremos conocerte mejor
            </p>
        </div>

        <div className="w-full flex flex-col gap-4 mb-20">
            {genderOptions.map((option) => {
            
            const isSelected = data.gender === option;

            return (
                <button
                    key={option}
                    onClick={() => updateData({ gender: option })}
                    className={`
                    w-full py-4 px-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2
                    ${isSelected 
                        // --- NUEVO ESTILO SELECCIONADO ---
                        // Fondo clarito (20%), borde sólido, texto morado y negrita
                        ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-[1.02]' 
                        
                        // Estilo no seleccionado (sin cambios importantes, aseguro border-2)
                        : 'bg-white/50 border-white/50 text-bluvi-purple hover:bg-white/80 hover:border-bluvi-purple/30'
                    }
                    `}
                >
                    {option}
                </button>
            );
            })}
        </div>

        <div className="w-full">
            <Button 
            aria-label="Siguiente paso" 
            className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!data.gender ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            >
            Siguiente
            </Button>
        </div>

        </div>
    );
};