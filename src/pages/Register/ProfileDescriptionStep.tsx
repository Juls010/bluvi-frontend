import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';


export const ProfileDescriptionStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, sendToBackend } = useRegister();
    const [isLoading, setIsLoading] = useState(false);

    const MAX_CHARS = 200;

    const handleNext = async () => {
        setIsLoading(true);
        try {
            const success = await sendToBackend();
            
            if (success) {
                navigate('/register/verificationemail');
            } else {
                alert("Hubo un error al procesar tu registro. Revisa los datos o inténtalo más tarde.");
            }
        } catch (error) {
            console.error("Error en el paso de descripción:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedStep>
            <div className="h-screen w-full flex flex-col items-center justify-between py-16 px-6 bg-transparent fixed inset-0">
                
                <div className="max-w-2xl w-full flex flex-col items-center text-start space-y-8 animate-fade-in">
                    <header className="space-y-4">
                        <h1 className="text-3xl font-bold text-[#2d3a7d]">Cuéntanos más sobre ti</h1>
                        <div className="text-[#5b6bb1] font-medium">
                            <p>Respira y tómate tu tiempo ...</p>
                            <p className="text-m ">Es importante que cuentes algo sobre ti para que los demás te conozcan</p>
                        </div>
                    </header>

                    <div className="w-full max-w-md relative mt-10">
                        <span className="absolute -top-6 right-0 text-xs text-[#5b6bb1] opacity-80">
                            {formData.description.length} / {MAX_CHARS}
                        </span>

                        <textarea 
                            value={formData.description}
                            onChange={(e) => updateFormData({description: e.target.value.slice(0, MAX_CHARS)})}
                            className="w-full h-64 p-6 rounded-3xl bg-white/40 border border-white/20 shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#3f4a9b]/20 text-gray-700 resize-none placeholder:text-gray-400/80 transition-all"
                            placeholder="Escribe aquí..."
                        />
                    </div>
                </div>

                <div className="w-full max-w-sm">
                    <Button 
                        onClick={handleNext}
                        disabled={formData.description.length === 0 || isLoading}
                        className="w-full py-3 bg-[#3f4a9b] text-white rounded-lg shadow-md font-semibold"
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </AnimatedStep>
    );
};