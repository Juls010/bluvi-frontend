import { useState } from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { authService } from '../../services/auth.service';

export const EmailStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email.trim()); 
    };

    const validatePassword = (pass: string) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
        return re.test(pass);
    };

    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const canContinue = isEmailValid && isPasswordValid;

    const handleNext = async () => {
        if (!canContinue || isLoading) return;

        setIsLoading(true);
        setServerError('');

        try {
            const response = await authService.checkEmail(formData.email);
            if (response.exists) {
                setServerError(response.message || 'Este email ya está registrado.');
            } else {
                navigate('/register/photos');
            }
        } catch (error: any) {
            console.error("Error comprobando email:", error);
            setServerError('Error al verificar el correo. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= 16) {
            updateFormData({ password: newValue });
        }
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between py-4 md:py-8">
                    
                    <div className="shrink-0">
                        <RegisterStepHeader
                            title="Crea tu cuenta"
                            subtitle="Para que puedas acceder de forma segura"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-10 px-1">
                        <div className="flex flex-col gap-6">
                            <InputField 
                                id="email"
                                label="Correo Electrónico" 
                                placeholder="hola@bluvi.com" 
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    updateFormData({ email: e.target.value.trim().toLowerCase() });
                                    if (serverError) setServerError('');
                                }}
                                state={
                                    serverError ? 'error' :
                                    formData.email.length === 0 ? 'default' : 
                                    isEmailValid ? 'success' : 'error'
                                }
                                helperText={
                                    serverError ? serverError :
                                    formData.email.length > 0 && !isEmailValid 
                                    ? "Introduce un correo válido" 
                                    : ""
                                }
                            />

                            <InputField 
                                id="password"
                                label="Contraseña" 
                                placeholder="••••••••"
                                type="password"
                                value={formData.password}
                                onChange={handlePasswordChange}
                                state={
                                    formData.password.length === 0 ? 'default' : 
                                    isPasswordValid ? 'success' : 'default'
                                }
                                helperText={
                                    formData.password.length > 0 && !isPasswordValid 
                                    ? "Usa mayúscula, minúscula, número y símbolo." 
                                    : "8-16 caracteres, mayús, minús, número y símbolo."
                                }
                            />
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            aria-label="Continuar" 
                            disabled={!canContinue || isLoading}
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 
                                ${!canContinue || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 bg-bluvi-purple text-white shadow-bluvi-purple/20'}`}
                            onClick={handleNext}
                        >
                            {isLoading ? 'Verificando...' : 'Continuar'}
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};