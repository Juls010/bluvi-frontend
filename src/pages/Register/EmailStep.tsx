import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

export const EmailStep: React.FC = () => {
    const navigate = useNavigate();
    const { data, updateData } = useRegister();

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // REGEX PASSWORD 
    // Explicación del jeroglífico:
    // (?=.*[a-z]) -> Al menos una minúscula
    // (?=.*[A-Z]) -> Al menos una mayúscula
    // (?=.*\d)    -> Al menos un número
    // (?=.*[\W_]) -> Al menos un carácter especial (!, @, #, $, etc.)
    // .{8,16}     -> Longitud entre 8 y 16
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

    useEffect(() => {
        setIsEmailValid(emailRegex.test(data.email));
        setIsPasswordValid(passwordRegex.test(data.password));
    }, [data.email, data.password]);

    const handleNext = () => {
        if (!isEmailValid || !isPasswordValid) return;
        navigate('/register/success');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 16) {
            updateData({ password: newValue });
        }
    };

    return (
        <div className="w-full max-w-md px-6 animate-fade-in">
            
            <div className="w-full text-left mb-8">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-bluvi-purple mb-2">
                    Crea tu cuenta
                </h1>
                <p className="text-bluvi-purple/70 text-lg font-medium">
                    Para que puedas acceder de forma segura
                </p>
            </div>

            <div className="w-full flex flex-col gap-6 mb-20">

                <InputField 
                    id="email"
                    label="Correo Electrónico" 
                    placeholder="hola@bluvi.com" 
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    state={
                        data.email.length === 0 ? 'default' : 
                        isEmailValid ? 'success' : 'error'
                    }
                    helperText={
                        data.email.length > 0 && !isEmailValid 
                        ? "Introduce un correo válido" 
                        : ""
                    }
                />

                <InputField 
                    id="password"
                    label="Contraseña" 
                    placeholder="••••••••"
                    type="password"
                    value={data.password}
                    onChange={handlePasswordChange}
                    state={
                        data.password.length === 0 ? 'default' : 
                        isPasswordValid ? 'success' : 'default'
                    }
                    helperText={
                        data.password.length > 0 && !isPasswordValid 
                        ? "Usa mayúscula, minúscula, número y símbolo." 
                        : "8-16 caracteres, mayús, minús, número y símbolo."
                    }
                />
            </div>

            <div className="w-full">
                <Button 
                    ariaLabel="Continuar" 
                    className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${(!isEmailValid || !isPasswordValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNext}
                >
                    Continuar
                </Button>
            </div>

        </div>
    );
};