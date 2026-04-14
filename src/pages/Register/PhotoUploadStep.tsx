import React, { useState, useRef } from 'react';
import { Camera, Plus, X, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';

export const PhotoUploadStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const photos = formData.photos;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectingIndex, setSelectingIndex] = useState<number | null>(null);

    const handleNext = () => {
        if (photos[0]) {
            navigate('/register/location'); 
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectingIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotos = [...photos];
                newPhotos[selectingIndex] = reader.result as string;
                updateFormData({ photos: newPhotos });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = (index: number) => {
        setSelectingIndex(index);
        fileInputRef.current?.click();
    };

    const removePhoto = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newPhotos = [...photos];
        newPhotos[index] = null;
        updateFormData({ photos: newPhotos });
    };

    return (
        <AnimatedStep className="pt-4 pb-2 md:pt-8 md:pb-4 [@media(max-height:900px)]:pt-2 [@media(max-height:900px)]:pb-1 [@media(max-height:760px)]:pt-1 [@media(max-height:760px)]:pb-0">
            <div className="w-full h-full flex flex-col items-center py-0 px-4 md:px-6 animate-fade-in min-h-0">
            <div className="max-w-2xl [@media(max-height:900px)]:max-w-xl [@media(max-height:760px)]:max-w-lg w-full h-full min-h-0 flex flex-col gap-4 md:gap-5 [@media(max-height:900px)]:gap-3 [@media(max-height:760px)]:gap-2">
                    
                    <RegisterStepHeader
                        title="Muestra tu esencia"
                        subtitle="Las fotos ayudan a que las conexiones sean más reales y seguras. ¡Elige tus favoritas!"
                        align="center"
                        compactOnShort
                    />

                    <div className="min-h-0 overflow-y-auto overflow-x-visible no-scrollbar px-1 pt-2 [@media(max-height:900px)]:pt-1.5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-3.5 [@media(max-height:900px)]:gap-2.5 [@media(max-height:760px)]:gap-2 auto-rows-fr">

                            <button 
                                type="button"
                                onClick={() => triggerUpload(0)}
                                aria-label={photos[0] ? "Cambiar foto principal" : "Subir foto principal"}
                                className="col-span-2 row-span-2 relative aspect-square group focus:outline-none focus:ring-4 focus:ring-inset focus:ring-bluvi-purple/30 rounded-[2rem]"
                            >
                                <div className={`w-full h-full rounded-[2rem] border-[3px] border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center
                                    ${photos[0] ? 'border-white shadow-2xl' : 'border-bluvi-light-purple bg-white/30 hover:bg-white/50'}`}>
                                    
                                    {photos[0] ? (
                                        <img src={photos[0]} className="w-full h-full object-cover" alt="Tu foto principal de perfil" />
                                    ) : (
                                        <div className="text-center">
                                            <Camera size={42} className="text-bluvi-purple/50 mx-auto mb-1.5" aria-hidden="true" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-bluvi-purple/60">Foto Principal</span>
                                        </div>
                                    )}
                                </div>

                                {photos[0] && (
                                    <>
                                        <div className="absolute bottom-3 left-3 bg-bluvi-purple text-white px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                                            <CheckCircle2 size={14} aria-hidden="true" /> Tu carta de presentación
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => removePhoto(0, e)}
                                            aria-label="Eliminar foto principal"
                                            className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                                        >
                                            <X size={18} aria-hidden="true" />
                                        </button>
                                    </>
                                )}
                            </button>

                            {photos.slice(1).map((photo, i) => {
                                const actualIndex = i + 1;
                                return (
                                    <button 
                                        key={actualIndex}
                                        type="button"
                                        onClick={() => triggerUpload(actualIndex)}
                                        aria-label={photo ? `Cambiar foto ${actualIndex + 1}` : `Subir foto secundaria ${actualIndex + 1}`}
                                        className="relative aspect-square group focus:outline-none focus:ring-4 focus:ring-inset focus:ring-bluvi-purple/30 rounded-2xl"
                                    >
                                        <div className={`w-full h-full rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden
                                            ${photo ? 'border-white shadow-lg' : 'border-bluvi-light-purple/40 bg-white/10 hover:bg-white/30'}`}>
                                            
                                            {photo ? (
                                                <img src={photo} className="w-full h-full object-cover" alt={`Foto secundaria ${actualIndex + 1}`} />
                                            ) : (
                                                <Plus size={24} className="text-bluvi-purple/30" aria-hidden="true" />
                                            )}
                                        </div>

                                        {photo && (
                                            <button 
                                                type="button"
                                                onClick={(e) => removePhoto(actualIndex, e)}
                                                aria-label={`Eliminar foto ${actualIndex + 1}`}
                                                className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 z-10"
                                            >
                                                <X size={14} aria-hidden="true" />
                                            </button>
                                        )}
                                    </button>
                                );
                            })}
                        
                        </div>

                        <div className="mt-3 bg-white/20 backdrop-blur-sm border border-white/40 p-3.5 [@media(max-height:900px)]:p-3 rounded-2xl flex items-start gap-2.5 [@media(max-height:900px)]:gap-2 max-w-2xl mx-auto">
                            <Info className="text-bluvi-purple shrink-0" size={18} />
                            <p className="text-[13px] md:text-sm text-gray-700 italic leading-relaxed [@media(max-height:900px)]:leading-snug">
                                Consejo: Las fotos con buena iluminación y donde se vea tu sonrisa suelen tener mejores conexiones.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4 md:pt-5 [@media(max-height:900px)]:pt-2 [@media(max-height:760px)]:pt-1.5 shrink-0">
                        <button 
                            onClick={handleNext} 
                            disabled={!photos[0]}
                            className={`w-full md:w-72 py-3.5 [@media(max-height:900px)]:py-2.5 rounded-full font-bold text-base md:text-lg [@media(max-height:900px)]:text-sm shadow-xl transition-all
                            ${photos[0] ? 'bg-bluvi-purple text-white' : 'bg-gray-200 text-gray-400'}`}
                        >
                            Continuar
                        </button>
                    </div>

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
            </div>
        </AnimatedStep>
    );
};