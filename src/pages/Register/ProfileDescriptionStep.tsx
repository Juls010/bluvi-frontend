import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { AnimatedStep } from '../../components/AnimatedStep';
import { AccessibleErrorTooltip } from '../../components/AccessibleErrorTooltip';
import { useRegister } from '../../context/RegisterContext';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';


export const ProfileDescriptionStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, sendToBackend } = useRegister();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const MAX_CHARS = 200;

    const handleNext = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const success = await sendToBackend();
            
            if (success) {
                navigate('/register/verificationemail');
            }
        } catch (error: any) {
            console.error("Error en el paso de descripción:", error);
            setErrorMessage(error.message || 'Error al conectar con el servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-2xl w-full h-full min-h-0 flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">
                    
                    <div className="shrink-0 flex flex-col items-start w-full">
                        <RegisterStepHeader
                            title="Cuéntanos más sobre ti"
                            subtitle={
                                <div className="space-y-1">
                                    <p>Respira y tómate tu tiempo ...</p>
                                    <p>Es importante que cuentes algo sobre ti para que los demás te conozcan</p>
                                </div>
                            }
                            align="left"
                            compactOnShort
                            className="mb-2 w-full max-w-xl"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-visible py-20 md:py-32 md:[@media(max-height:1000px)]:py-14 px-5 flex flex-col items-center">
                        <div className="w-full max-w-md md:max-w-xl relative mt-12 md:[@media(max-height:1000px)]:mt-8 px-1">
                            <span 
                                id="char-count" 
                                className="absolute -top-8 right-1 text-xs text-[#5b6bb1] opacity-80"
                                aria-live="polite"
                            >
                                {formData.description.length} / {MAX_CHARS}
                            </span>

                            <textarea 
                                id="profile-description"
                                aria-label="Tu descripción personal"
                                aria-describedby={`char-count ${errorMessage ? 'profile-description-error' : ''}`.trim()}
                                aria-invalid={!!errorMessage}
                                value={formData.description}
                                onChange={(e) => {
                                    const sanitizedValue = e.target.value.replace(/[<>]/g, '');
                                    updateFormData({description: sanitizedValue.slice(0, MAX_CHARS)});
                                    if (errorMessage) {
                                        setErrorMessage('');
                                    }
                                }}
                                className="w-full h-64 md:h-80 md:[@media(max-height:1000px)]:h-56 p-6 rounded-3xl bg-white/40 border border-white/20 shadow-sm backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40 text-gray-700 resize-none placeholder:text-gray-400/80 transition-all font-sans text-lg"
                                placeholder="Escribe aquí..."
                            />
                        </div>

                        <AccessibleErrorTooltip id="profile-description-error" message={errorMessage} className="w-full max-w-md md:max-w-xl mt-4" />
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            onClick={handleNext}
                            disabled={formData.description.length === 0 || isLoading}
                            aria-describedby={errorMessage ? 'profile-description-error' : undefined}
                            className={`w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300
                                ${formData.description.length > 0 && !isLoading 
                                    ? 'bg-bluvi-purple text-white hover:scale-102 active:scale-98' 
                                    : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                                }
                            `}
                        >
                            {isLoading ? 'Cargando...' : 'Siguiente'}
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};
