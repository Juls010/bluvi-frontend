import React, { useState, useRef } from 'react';
import { Camera, Plus, X, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PhotoUploadStep = () => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null]);
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
                setPhotos(newPhotos);
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
        setPhotos(newPhotos);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-12 px-6 animate-fade-in">
            <div className="max-w-4xl w-full space-y-10">
                
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-bluvi-purple">Muestra tu esencia</h1>
                    <p className="text-gray-600 max-w-md mx-auto font-medium">
                        Las fotos ayudan a que las conexiones sean más reales y seguras. ¡Elige tus favoritas!
                    </p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">

                    <button 
                        type="button"
                        onClick={() => triggerUpload(0)}
                        aria-label={photos[0] ? "Cambiar foto principal" : "Subir foto principal"}
                        className="col-span-2 row-span-2 relative aspect-square group focus:outline-none focus:ring-4 focus:ring-bluvi-purple/30 rounded-[2.5rem]"
                    >
                        <div className={`w-full h-full rounded-[2.5rem] border-4 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center
                            ${photos[0] ? 'border-white shadow-2xl' : 'border-bluvi-light-purple bg-white/30 hover:bg-white/50'}`}>
                            
                            {photos[0] ? (
                                <img src={photos[0]} className="w-full h-full object-cover" alt="Tu foto principal de perfil" />
                            ) : (
                                <div className="text-center">
                                    <Camera size={48} className="text-bluvi-purple/50 mx-auto mb-2" aria-hidden="true" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-bluvi-purple/60">Foto Principal</span>
                                </div>
                            )}
                        </div>

                        {photos[0] && (
                            <>
                                <div className="absolute bottom-4 left-4 bg-bluvi-purple text-white px-4 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg backdrop-blur-md">
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
                                className="relative aspect-square group focus:outline-none focus:ring-4 focus:ring-bluvi-purple/30 rounded-3xl"
                            >
                                <div className={`w-full h-full rounded-3xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden
                                    ${photo ? 'border-white shadow-lg' : 'border-bluvi-light-purple/40 bg-white/10 hover:bg-white/30'}`}>
                                    
                                    {photo ? (
                                        <img src={photo} className="w-full h-full object-cover" alt={`Foto secundaria ${actualIndex + 1}`} />
                                    ) : (
                                        <Plus size={28} className="text-bluvi-purple/30" aria-hidden="true" />
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

                <div className="bg-white/20 backdrop-blur-sm border border-white/40 p-4 rounded-2xl flex items-start gap-3 max-w-2xl mx-auto">
                    <Info className="text-bluvi-purple shrink-0" size={20} />
                    <p className="text-sm text-gray-700 italic">
                        Consejo: Las fotos con buena iluminación y donde se vea tu sonrisa suelen tener mejores conexiones.
                    </p>
                </div>

                <div className="flex justify-center pt-4">
                    <button 
                        onClick={handleNext} 
                        disabled={!photos[0]}
                        className={`w-full md:w-80 py-4 rounded-full font-bold text-lg shadow-xl transition-all
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
    );
};