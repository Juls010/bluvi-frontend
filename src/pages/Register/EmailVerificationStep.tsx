import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '../../components/Button';
import { AnimatedStep } from '../../components/AnimatedStep';
import { AccessibleErrorTooltip } from '../../components/AccessibleErrorTooltip';
import { SuccessModal } from '../../components/SuccessModal';
import { authService } from '../../services/auth.service';
import { useRegister } from '../../context/RegisterContext';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

const getApiErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response;

        if (
            response &&
            typeof response === 'object' &&
            'data' in response &&
            response.data &&
            typeof response.data === 'object' &&
            'message' in response.data &&
            typeof response.data.message === 'string'
        ) {
            return response.data.message;
        }
    }

    return fallback;
};

export const EmailVerificationStep = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '','','']);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(true);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const { formData } = useRegister();

    const handleVerifyCode = async () => {
        const fullCode = code.join('');
        const email = formData.email || localStorage.getItem('temp_email_verification'); 

        if (!email) {
            setErrorMessage('No se encontro el email del registro. Por favor, reinicia el proceso.');
            return;
        }

        setErrorMessage('');

        try {
            const response = await authService.verifyEmail(fullCode, email);
            
            if (response.success) {
                localStorage.removeItem('temp_email_verification');
                navigate('/register/safety-tips'); 
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Codigo incorrecto. Revisa el codigo y vuelve a intentarlo.'));
        }
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (errorMessage) {
            setErrorMessage('');
        }

        if (value !== '' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">
                    
                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="Verifica tu correo"
                            subtitle="Te hemos enviado un código de 6 dígitos para proteger tu cuenta."
                            align="left"
                            compactOnShort
                            className="w-full mb-6"
                        />
                        <div className="w-full flex justify-center mb-4">
                            <div className="bg-white/40 p-5 rounded-full backdrop-blur-sm border border-white/20 shadow-sm shrink-0">
                                <Mail className="text-[#3f4a9b]" size={36} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center justify-start space-y-12">
                        <div className="flex gap-2 md:gap-4 justify-center" role="group" aria-label="Código de verificación">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={1}
                                    value={digit}
                                    aria-label={`Dígito ${index + 1} del código`}
                                    aria-invalid={!!errorMessage}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl bg-white/50 border border-white/30 shadow-sm backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40 text-bluvi-purple transition-all"
                                />
                            ))}
                        </div>

                        <button className="flex items-center gap-2 text-bluvi-purple/70 hover:text-bluvi-purple text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/40 rounded px-2 py-1">
                            <RefreshCw size={16} />
                            Reenviar código
                        </button>

                        <AccessibleErrorTooltip id="email-verification-error" message={errorMessage} className="max-w-sm" />
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            onClick={handleVerifyCode}
                            disabled={code.some(d => d === '')}
                            aria-describedby={errorMessage ? 'email-verification-error' : undefined}
                            className={`w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300
                                ${!code.some(d => d === '') 
                                    ? 'bg-bluvi-purple text-white hover:scale-102 active:scale-98' 
                                    : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                                }
                            `}
                        >
                            Verificar y continuar
                        </Button>
                    </div>

                    <SuccessModal
                        isOpen={isInfoModalOpen}
                        onClose={() => setIsInfoModalOpen(false)}
                    />
                </div>
            </div>
        </AnimatedStep>
    );
};
