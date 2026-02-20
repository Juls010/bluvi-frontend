import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';

export const EmailStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

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

    const handleNext = () => {
        if (canContinue) {
            navigate('/register/photos');
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
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        state={
                            formData.email.length === 0 ? 'default' : 
                            isEmailValid ? 'success' : 'error'
                        }
                        helperText={
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

                <div className="w-full">
                    <Button 
                        aria-label="Continuar" 
                        disabled={!canContinue}
                        className={`w-full py-3.5 text-lg shadow-md transition-all duration-300 ${!canContinue ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        onClick={handleNext}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </AnimatedStep>
    );
};