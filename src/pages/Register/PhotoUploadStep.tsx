import React, { useState, useRef } from 'react';
import { Camera, Plus, X, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { uploadUserPhoto } from '../../services/uploadService';
import { toastQueue } from '../../components/Toast/GlobalToast';

export const PhotoUploadStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const photos = formData.photos;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectingIndex, setSelectingIndex] = useState<number | null>(null);
    const [loadingIndices, setLoadingIndices] = useState<Set<number>>(new Set());

    const handleNext = () => {
        if (photos[0]) {
            navigate('/register/location'); 
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectingIndex !== null) {
            setLoadingIndices(prev => new Set(prev).add(selectingIndex));
            
            try {
                const { url, error } = await uploadUserPhoto(file);
                
                if (error) {
                    console.error('Error al subir foto:', error);
                    toastQueue.add({ message: 'Hubo un error al subir la foto. Por favor, inténtalo de nuevo.', type: 'error' }, { timeout: 6000 });
                } else if (url) {
                    const newPhotos = [...photos];
                    newPhotos[selectingIndex] = url;
                    updateFormData({ photos: newPhotos });
                    toastQueue.add({ message: 'Foto subida correctamente', type: 'success' }, { timeout: 5000 });
                }
            } finally {
                setLoadingIndices(prev => {
                    const next = new Set(prev);
                    next.delete(selectingIndex);
                    return next;
                });
                setSelectingIndex(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const triggerUpload = (index: number) => {
        if (loadingIndices.has(index)) return;
        setSelectingIndex(index);
        fileInputRef.current?.click();
    };

    const removePhoto = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (loadingIndices.has(index)) return;
        const newPhotos = [...photos];
        newPhotos[index] = null;
        updateFormData({ photos: newPhotos });
    };

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-2xl w-full h-full min-h-0 flex flex-col justify-between pt-10 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-6 md:[@media(max-height:1000px)]:pb-4">
                    
                    <div className="shrink-0">
                        <RegisterStepHeader
                            title="Muestra tu esencia"
                            subtitle="Las fotos ayudan a que las conexiones sean más reales y seguras. ¡Elige tus favoritas!"
                            align="left"
                            compactOnShort
                            className="mb-0 md:mb-10"
                        />
                    </div>

                    <div className="flex-grow min-h-0 overflow-y-auto overflow-x-visible no-scrollbar px-10 py-10 md:py-32 md:[@media(max-height:1000px)]:py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 auto-rows-fr">

                            <div className="col-span-2 row-span-2 relative aspect-square group rounded-[2rem]">
                                <button 
                                    type="button"
                                    onClick={() => triggerUpload(0)}
                                    aria-label={photos[0] ? "Cambiar foto principal" : "Subir foto principal"}
                                    className={`w-full h-full rounded-[2rem] border-[3px] border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/60
                                        ${photos[0] ? 'border-white shadow-2xl' : 'border-bluvi-light-purple bg-white/30 hover:bg-white/50'}`}
                                >
                                    
                                    {loadingIndices.has(0) ? (
                                        <div className="flex flex-col items-center justify-center animate-pulse">
                                            <Loader2 size={42} className="text-bluvi-purple animate-spin mb-1.5" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-bluvi-purple/60">Subiendo...</span>
                                        </div>
                                    ) : photos[0] ? (
                                        <img src={photos[0]} className="w-full h-full object-cover" alt="Tu foto principal de perfil" />
                                    ) : (
                                        <div className="text-center">
                                            <Camera size={42} className="text-bluvi-purple/50 mx-auto mb-1.5" aria-hidden="true" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-bluvi-purple/60">Foto Principal</span>
                                        </div>
                                    )}
                                </button>

                                {photos[0] && (
                                    <>
                                        <div className="absolute bottom-3 left-3 bg-bluvi-purple text-white px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-lg backdrop-blur-md pointer-events-none">
                                            <CheckCircle2 size={14} aria-hidden="true" /> Tu carta de presentación
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => removePhoto(0, e)}
                                            aria-label="Eliminar foto principal"
                                            className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50"
                                        >
                                            <X size={18} aria-hidden="true" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {photos.slice(1).map((photo, i) => {
                                const actualIndex = i + 1;
                                return (
                                    <div 
                                        key={actualIndex}
                                        className="relative aspect-square group rounded-2xl"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => triggerUpload(actualIndex)}
                                            aria-label={photo ? `Cambiar foto ${actualIndex + 1}` : `Subir foto secundaria ${actualIndex + 1}`}
                                            className={`w-full h-full rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40
                                                ${photo ? 'border-white shadow-lg' : 'border-bluvi-light-purple/40 bg-white/10 hover:bg-white/30'}`}
                                        >
                                            {loadingIndices.has(actualIndex) ? (
                                                <Loader2 size={24} className="text-bluvi-purple animate-spin" />
                                            ) : photo ? (
                                                <img src={photo} className="w-full h-full object-cover" alt={`Foto secundaria ${actualIndex +actualIndex}`} />
                                            ) : (
                                                <Plus size={24} className="text-bluvi-purple/30" aria-hidden="true" />
                                            )}
                                        </button>

                                        {photo && (
                                            <button 
                                                type="button"
                                                onClick={(e) => removePhoto(actualIndex, e)}
                                                aria-label={`Eliminar foto ${actualIndex + 1}`}
                                                className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50"
                                            >
                                                <X size={14} aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        
                        </div>

                        <div className="hidden md:flex mt-8 md:[@media(max-height:1000px)]:mt-4 bg-white/20 backdrop-blur-sm border border-white/40 p-3 md:[@media(max-height:1000px)]:p-2 rounded-2xl items-start gap-2.5 max-w-2xl mx-auto shadow-sm">
                            <Info className="text-bluvi-purple shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-gray-700 italic leading-relaxed">
                                Consejo: Las fotos con buena iluminación y donde se vea tu sonrisa suelen tener mejores conexiones.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button 
                            aria-label="Continuar"
                            onClick={handleNext} 
                            disabled={!photos[0]}
                            className={`w-full max-w-sm py-4 rounded-full text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300
                            ${photos[0] ? 'bg-bluvi-purple text-white hover:scale-102 active:scale-98' : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'}`}
                        >
                            Continuar
                        </Button>
                    </div>

                    <input 
                        id="register-file-input"
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
