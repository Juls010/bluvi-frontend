import React from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

export const NameStep: React.FC = () => {
    const navigate = useNavigate();
    
    const { data, updateData } = useRegister();
    
    const isValid = data.firstName.trim().length > 0;

    const handleNext = () => {
        if (!isValid) return;
        
        navigate('/register/age');
    };

    return (
        <div className="w-full max-w-md px-6 animate-fade-in">

            <div className="w-full text-left mb-8"> 
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                    ¿Cómo te llamas?
                </h1>
                <p className="text-bluvi-purple/70 text-lg font-medium">
                    ¡Nos emociona conocerte!
                </p>
            </div>

            <div className="w-full flex flex-col gap-6 mb-20">
                <InputField 
                    id="nombre" label="Nombre" 
                    value={data.firstName} 
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    placeholder='Aurora'
                />
                
                <InputField 
                    id="apellidos" label="Apellidos" 
                    value={data.lastName}
                    onChange={(e) => updateData({ lastName: e.target.value })}
                    placeholder='Montenegro'
                />
            </div>

            <div className="w-full">
                <Button 
                    onClick={handleNext} 
                    ariaLabel="Siguiente" 
                    className={`w-full py-3.5 shadow-md transition-all duration-300 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Siguiente
                </Button>
            </div>

        </div>
    );
};