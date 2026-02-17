import React from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import { AnimatedStep } from '../../components/AnimatedStep';

export const DocumentStep: React.FC = () => {
    const navigate = useNavigate();
    
    const { data, updateData } = useRegister();

    const fileName = data.documentFile?.name;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            updateData({ documentFile: file });
        }
    };

    const handleNext = () => {
        if (!data.documentFile) return; 
        
        console.log("Documento listo para enviar:", data.documentFile.name);
        

        
        navigate('/register/success'); 
    };

    return (
        <AnimatedStep>
            <div className="w-full max-w-md px-6 animate-fade-in">
                
                <div className="w-full text-left mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-bluvi-purple mb-3">
                        Seguridad ante todo
                    </h1>
                    <p className="text-bluvi-purple/80 text-lg leading-relaxed font-medium">
                        Para garantizar un espacio seguro, necesitamos que subas tu 
                        <strong> Certificado de Delitos de Naturaleza Sexual</strong>.
                    </p>
                    <p className="text-sm text-bluvi-purple/60 mt-3 italic font-medium">
                        * Tus datos serán tratados con máxima confidencialidad y encriptados.
                    </p>
                </div>

                <div className="w-full mb-20">
                    <label 
                        htmlFor="file-upload" 
                        className={`
                            flex flex-col items-center justify-center w-full h-48 
                            border-2 border-dashed rounded-2xl cursor-pointer 
                            transition-all duration-300
                            ${fileName 
                                ? 'border-bluvi-purple bg-bluvi-purple/10' 
                                : 'border-bluvi-purple/30 bg-white/30 hover:bg-white/50 hover:border-bluvi-purple/50'
                            }
                        `}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            {fileName ? (
                                <>
                                    <svg className="w-10 h-10 text-bluvi-purple mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-lg font-semibold text-bluvi-purple break-all">{fileName}</p>
                                    <p className="text-sm text-bluvi-purple/70 mt-1">Click para cambiar</p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-10 h-10 text-bluvi-purple/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-lg text-bluvi-purple font-medium">Sube tu certificado (PDF)</p>
                                    <p className="text-sm text-bluvi-purple/60">Pulsa aquí para buscar el archivo</p>
                                </>
                            )}
                        </div>
                        
                        <input 
                            id="file-upload" 
                            type="file" 
                            accept=".pdf,.jpg,.png" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                <div className="w-full">
                    <Button 
                        aria-label="Enviar documentación y finalizar" 
                        className={`w-full py-3.5 text-lg shadow-md ${!fileName ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleNext}
                    >
                        Enviar y Finalizar
                    </Button>
                </div>

            </div>
        </AnimatedStep>
    );
};