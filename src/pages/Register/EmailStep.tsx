import {
    useState } from 'react';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { useNavigate,
    Link } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { authService } from '../../services/auth.service';
import { CheckIcon
} from '@phosphor-icons/react';

export const EmailStep: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showConsentError, setShowConsentError] = useState(false);

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
    const fieldsValid = isEmailValid && isPasswordValid;
    const canContinue = fieldsValid && formData.privacyAccepted;

    const handleNext = async () => {
        if (isLoading) return;
        if (!formData.privacyAccepted) {
            setShowConsentError(true);
            setTimeout(() => setShowConsentError(false), 2500);
            return;
        }
        if (!canContinue) return;

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
            console.error('Error comprobando email:', error);
            const backendMessage = error.response?.data?.message || 'Error al verificar el correo. Inténtalo de nuevo.';
            setServerError(backendMessage);
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
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">
                    
                    <div className="shrink-0">
                        <RegisterStepHeader
                            title="Crea tu cuenta"
                            subtitle="Para que puedas acceder de forma segura"
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center">
                        <div className="flex flex-col gap-8 md:gap-12 md:[@media(max-height:1000px)]:gap-6 w-full max-w-sm">
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
                                passwordToggleClassName="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-bluvi-purple/75 transition-all duration-300 hover:bg-bluvi-purple/5 hover:text-bluvi-purple active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/30"
                                state={
                                    formData.password.length === 0 ? 'default' : 
                                    isPasswordValid ? 'success' : 'default'
                                }
                                helperText={
                                    formData.password.length > 0 && !isPasswordValid 
                                    ? "Usa mayúscula, minúscula, número y símbolo." 
                                    : "8-16 caracteres, mayúscula, minúscula, número y símbolo."
                                }
                            />
                        </div>

                        <label
                            htmlFor="privacy-consent"
                            className="flex items-center gap-3 cursor-pointer group mt-10"
                        >
                            <button
                                id="privacy-consent"
                                type="button"
                                role="checkbox"
                                aria-checked={formData.privacyAccepted}
                                aria-label="Aceptar política de privacidad y aviso legal"
                                onClick={() => {
                                    updateFormData({ privacyAccepted: !formData.privacyAccepted });
                                    if (showConsentError) setShowConsentError(false);
                                }}
                                className={`
                                    shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 transition-all duration-500
                                    flex items-center justify-center
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f4a9b]/50
                                    ${formData.privacyAccepted
                                        ? 'bg-[#3f4a9b] border-[#3f4a9b] shadow-sm'
                                        : showConsentError
                                            ? 'bg-white/60 border-red-400'
                                            : 'bg-white/60 border-[#3f4a9b]/40 group-hover:border-[#3f4a9b]/70'
                                    }
                                `}
                            >
                                {formData.privacyAccepted && (
                                    <CheckIcon size={12} weight="bold" className="text-white" aria-hidden="true" />
                                )}
                            </button>
                            <span className={`text-xs leading-relaxed transition-colors duration-700 ${showConsentError ? 'text-red-400' : 'text-gray-600'}`}>
                                He leído y acepto la{' '}
                                <Link
                                    to="/privacidad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold underline underline-offset-2 transition-colors duration-700"
                                    style={{ color: showConsentError ? '#f87171' : '#3f4a9b' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Política de Privacidad
                                </Link>
                                {' '}y el{' '}
                                <Link
                                    to="/legal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold underline underline-offset-2 transition-colors duration-700"
                                    style={{ color: showConsentError ? '#f87171' : '#3f4a9b' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Aviso Legal
                                </Link>
                                {' '}de Bluvi.
                            </span>
                        </label>
                    </div>
                

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            aria-label="Continuar" 
                            disabled={!fieldsValid || isLoading}
                            className={`w-full max-w-sm py-4 text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300 
                                ${!canContinue || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98 bg-bluvi-purple text-white shadow-bluvi-purple/20'}`}
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
