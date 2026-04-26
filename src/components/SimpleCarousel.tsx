import React, { useState, useRef } from 'react';
import { UserCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCarouselProps {
    photos: string[]; 
    firstName: string; 
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ photos, firstName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
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

    if (!photos || photos.length === 0) {
        return (
            <div className="w-full aspect-[4/5] rounded-3xl bg-app-surface-soft border border-app-soft flex items-center justify-center">
                <UserCircle2 className="w-14 h-14 text-app-muted" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full max-h-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg bg-app-surface-soft border border-app-soft group">

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
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
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
        </div>
    );
};
