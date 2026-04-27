import React, { useState, useRef } from 'react';
import { UserCircle2, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface SimpleCarouselProps {
    photos: string[]; 
    firstName: string; 
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ photos, firstName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollPosition = scrollRef.current.scrollLeft;
            const width = scrollRef.current.offsetWidth;
            if (width > 0) {
                const newIndex = Math.round(scrollPosition / width);
                setCurrentIndex(newIndex);
            }
        }
    };

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth' 
            });
        }
    };

    // Keyboard support for Lightbox
    useEffect(() => {
        if (!showLightbox) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLightbox(false);
            if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
            if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLightbox, photos.length]);

    // Keyboard support for main carousel (when focused)
    const handleKeyDownMain = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < photos.length - 1) scrollTo(currentIndex + 1);
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) scrollTo(currentIndex - 1);
        }
    };

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full aspect-[4/5] rounded-3xl bg-app-surface-soft border border-app-soft flex items-center justify-center">
                <UserCircle2 className="w-14 h-14 text-app-muted" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div 
            className="relative w-full h-full max-h-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg bg-app-surface-soft border border-app-soft group focus-visible:ring-4 focus-visible:ring-app-accent/20 outline-none"
            role="region"
            aria-roledescription="carrusel"
            aria-label={`Galería de fotos de ${firstName}`}
            tabIndex={0}
            onKeyDown={handleKeyDownMain}
        >

            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {photos.map((url, index) => (
                    <div 
                        key={`${url}-${index}`} 
                        className="w-full h-full flex-shrink-0 snap-center relative"
                    >
                        <img 
                            src={url} 
                            alt={`Foto ${index + 1} de ${firstName}`} 
                            className="w-full h-full object-cover cursor-pointer"
                            draggable={false}
                            onClick={() => setShowLightbox(true)}
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                            aria-label="Ver en grande"
                        >
                            <Maximize2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {photos.length > 1 && (
                <>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                        {photos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)} 
                                aria-label={`Ir a la foto ${index + 1}`}
                                aria-current={currentIndex === index}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm
                                    ${currentIndex === index ? 'bg-white w-5' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                        {currentIndex > 0 && (
                            <button 
                                onClick={() => scrollTo(currentIndex - 1)} 
                                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                                aria-label="Foto anterior"
                            >
                                <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        {currentIndex < photos.length - 1 && (
                            <button 
                                onClick={() => scrollTo(currentIndex + 1)} 
                                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                                aria-label="Siguiente foto"
                            >
                                <ChevronRight size={20} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </>
            )}

            {showLightbox && createPortal(
                <div 
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
                    onClick={() => setShowLightbox(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto de ${firstName} en pantalla completa`}
                >
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-20">
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Visualizando</span>
                            <span className="font-bold">{firstName}</span>
                        </div>
                        <button 
                            onClick={() => setShowLightbox(false)}
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        <img 
                            src={photos[currentIndex]} 
                            alt="" 
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-zoom-in"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {photos.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1)); }}
                                    className="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90 hidden md:flex"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0)); }}
                                    className="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90 hidden md:flex"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
                        {photos.map((_, index) => (
                            <div 
                                key={index}
                                role="progressbar"
                                aria-valuenow={currentIndex + 1}
                                aria-valuemin={1}
                                aria-valuemax={photos.length}
                                aria-label={`Foto ${index + 1} de ${photos.length}`}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === index ? 'w-10 bg-[#3f4292]' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
