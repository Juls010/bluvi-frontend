import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

export const DocumentStep: React.FC = () => {
    const navigate = useNavigate();
    const [documentFile, setDocumentFile] = React.useState<File | null>(null);

    const fileName = documentFile?.name;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocumentFile(file);
        }
    };

    const handleNext = () => {
        if (!documentFile) return; 
        
        console.log("Documento listo para enviar:", documentFile.name);
        

        
        navigate('/register/success'); 
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-md w-full h-full min-h-0 flex flex-col justify-between py-4 md:py-8">
                    
                    <div className="shrink-0">
                        <RegisterStepHeader
                            title="Seguridad ante todo"
                            subtitle={
                                <div className="space-y-3">
                                    <p>Para garantizar un espacio seguro, necesitamos que subas tu <strong>Certificado de Delitos de Naturaleza Sexual</strong>.</p>
                                    <p className="text-xs text-bluvi-purple/60 italic font-medium">
                                        * Tus datos serán tratados con máxima confidencialidad y encriptados.
                                    </p>
                                </div>
                            }
                            compactOnShort
                            className="mb-0"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto no-scrollbar py-10 px-1">
                        <label 
                            htmlFor="file-upload" 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    document.getElementById('file-upload')?.click();
                                }
                            }}
                            className={`
                                group flex flex-col items-center justify-center w-full min-h-[12rem]
                                border-2 border-dashed rounded-[2rem] cursor-pointer 
                                transition-all duration-300 outline-none
                                focus-within:ring-4 focus-within:ring-bluvi-purple/40
                                ${fileName 
                                    ? 'border-bluvi-purple bg-bluvi-purple/10' 
                                    : 'border-bluvi-purple/30 bg-white/30 hover:bg-white/50 hover:border-bluvi-purple/50'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                {fileName ? (
                                    <>
                                        <svg className="w-10 h-10 text-bluvi-purple mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="text-lg font-semibold text-bluvi-purple break-all">{fileName}</p>
                                        <p className="text-sm text-bluvi-purple/70 mt-1 uppercase font-bold tracking-wider">Click para cambiar</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-10 h-10 text-bluvi-purple/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="mb-2 text-lg text-bluvi-purple font-medium">Sube tu certificado (PDF)</p>
                                        <p className="text-sm text-bluvi-purple/60">Pulsa aquí para buscar el archivo</p>
                                    </>
                                )}
                            </div>
                            
                            <input 
                                id="file-upload" 
                                type="file" 
                                accept=".pdf,.jpg,.png" 
                                className="sr-only" 
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            aria-label="Enviar documentación y finalizar" 
                            className={`w-full max-w-sm py-4 rounded-full text-lg shadow-xl shadow-bluvi-purple/10 transition-all ${!fileName ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            onClick={handleNext}
                            disabled={!fileName}
                        >
                            Enviar y Finalizar
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep>
    );
};